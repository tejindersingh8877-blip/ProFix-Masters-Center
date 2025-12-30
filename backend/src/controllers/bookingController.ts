import { Response } from 'express';
import Booking, { BookingStatus, PaymentStatus } from '../models/Booking';
import Service from '../models/Service';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { sendBookingConfirmation } from '../utils/email';

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (Customer)
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const {
      serviceId,
      bookingDate,
      bookingTime,
      customerAddress,
      customerCity,
      customerZipCode,
      customerPhone,
      paymentMethod,
      notes
    } = req.body;

    // Get service details
    const service = await Service.findById(serviceId).populate('providerId');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Calculate pricing
    const servicePrice = service.basePrice;
    const commissionRate = service.customCommissionRate || parseFloat(process.env.DEFAULT_COMMISSION_RATE || '0.15');
    const commissionAmount = servicePrice * commissionRate;
    const providerEarning = servicePrice - commissionAmount;
    const totalAmount = servicePrice;

    // Create booking
    const booking = await Booking.create({
      customerId: req.user._id,
      providerId: service.providerId,
      serviceId,
      bookingDate,
      bookingTime,
      customerAddress,
      customerCity,
      customerZipCode,
      customerPhone,
      servicePrice,
      commissionRate,
      commissionAmount,
      providerEarning,
      totalAmount,
      paymentMethod,
      notes,
      status: BookingStatus.PENDING,
      paymentStatus: paymentMethod === 'cod' ? PaymentStatus.PENDING : PaymentStatus.COMPLETED
    });

    // Send confirmation email
    try {
      await sendBookingConfirmation(req.user.email, req.user.name, {
        service: service.title,
        date: bookingDate,
        time: bookingTime,
        amount: totalAmount
      });
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }

    res.status(201).json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query: any = {};

    // Filter based on user role
    if (req.user.role === 'customer') {
      query.customerId = req.user._id;
    } else if (req.user.role === 'provider') {
      query.providerId = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name email phone profilePhoto')
      .populate('providerId', 'name email phone profilePhoto rating')
      .populate('serviceId', 'title category basePrice')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
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

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email phone profilePhoto address')
      .populate('providerId', 'name email phone profilePhoto rating')
      .populate('serviceId', 'title description category basePrice duration');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (
      booking.customerId._id.toString() !== req.user._id.toString() &&
      booking.providerId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Provider/Admin)
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (
      booking.providerId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;

    // If booking is completed and payment is COD, update payment status
    if (status === BookingStatus.COMPLETED && booking.paymentMethod === 'cod') {
      booking.paymentStatus = PaymentStatus.COMPLETED;
      
      // Credit provider wallet
      const provider = await User.findById(booking.providerId);
      if (provider) {
        provider.wallet = (provider.wallet || 0) + booking.providerEarning;
        provider.totalEarnings = (provider.totalEarnings || 0) + booking.providerEarning;
        await provider.save();
      }
    }

    await booking.save();

    res.json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (
      booking.customerId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === BookingStatus.COMPLETED) {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancellationReason = cancellationReason;

    await booking.save();

    res.json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
