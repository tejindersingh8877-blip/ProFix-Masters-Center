import { Response } from 'express';
import User, { UserRole, ProviderStatus } from '../models/User';
import Payout, { PayoutStatus } from '../models/Payout';
import { AuthRequest } from '../middleware/auth';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const allowedUpdates = [
      'name', 'profilePhoto', 'address', 'city', 'state', 'zipCode',
      'experience', 'skills', 'serviceAreas', 'availability'
    ];

    const updates: any = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get provider by ID
// @route   GET /api/users/provider/:id
// @access  Public
export const getProviderById = async (req: AuthRequest, res: Response) => {
  try {
    const provider = await User.findOne({
      _id: req.params.id,
      role: UserRole.PROVIDER,
      providerStatus: ProviderStatus.APPROVED
    }).select('-password');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json({ success: true, provider });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request payout
// @route   POST /api/users/payout
// @access  Private (Provider)
export const requestPayout = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, bankDetails } = req.body;

    if (req.user.role !== UserRole.PROVIDER) {
      return res.status(403).json({ message: 'Only providers can request payouts' });
    }

    const user = await User.findById(req.user._id);
    if (!user || (user.wallet || 0) < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Create payout request
    const payout = await Payout.create({
      providerId: req.user._id,
      amount,
      bankDetails,
      status: PayoutStatus.PENDING
    });

    // Deduct from wallet
    user.wallet = (user.wallet || 0) - amount;
    await user.save();

    res.status(201).json({ success: true, payout });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payout history
// @route   GET /api/users/payouts
// @access  Private (Provider)
export const getPayouts = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== UserRole.PROVIDER) {
      return res.status(403).json({ message: 'Only providers can view payouts' });
    }

    const { page = 1, limit = 10 } = req.query;

    const payouts = await Payout.find({ providerId: req.user._id })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Payout.countDocuments({ providerId: req.user._id });

    res.json({
      success: true,
      payouts,
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

// @desc    Upload documents (certificates, ID)
// @route   POST /api/users/documents
// @access  Private (Provider)
export const uploadDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { certificates, idProof } = req.body;

    if (req.user.role !== UserRole.PROVIDER) {
      return res.status(403).json({ message: 'Only providers can upload documents' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (certificates) {
      user.certificates = certificates;
    }

    if (idProof) {
      user.idProof = idProof;
    }

    await user.save();

    res.json({ success: true, message: 'Documents uploaded successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
