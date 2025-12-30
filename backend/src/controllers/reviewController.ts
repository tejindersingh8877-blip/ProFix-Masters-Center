import { Response } from 'express';
import Review from '../models/Review';
import Booking, { BookingStatus } from '../models/Booking';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// @desc    Create review
// @route   POST /api/reviews
// @access  Private (Customer)
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already submitted for this booking' });
    }

    // Create review
    const review = await Review.create({
      bookingId,
      customerId: req.user._id,
      providerId: booking.providerId,
      serviceId: booking.serviceId,
      rating,
      comment
    });

    // Update provider rating
    const provider = await User.findById(booking.providerId);
    if (provider) {
      const totalReviews = (provider.totalReviews || 0) + 1;
      const currentRating = provider.rating || 0;
      const newRating = ((currentRating * (totalReviews - 1)) + rating) / totalReviews;
      
      provider.rating = newRating;
      provider.totalReviews = totalReviews;
      await provider.save();
    }

    res.status(201).json({ success: true, review });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get provider reviews
// @route   GET /api/reviews/provider/:providerId
// @access  Public
export const getProviderReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate('customerId', 'name profilePhoto')
      .populate('serviceId', 'title category')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ providerId: req.params.providerId });

    res.json({
      success: true,
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get review by booking
// @route   GET /api/reviews/booking/:bookingId
// @access  Private
export const getReviewByBooking = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findOne({ bookingId: req.params.bookingId })
      .populate('customerId', 'name profilePhoto')
      .populate('serviceId', 'title category');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ success: true, review });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
