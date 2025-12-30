import { Response } from 'express';
import User, { UserRole, ProviderStatus } from '../models/User';
import Booking from '../models/Booking';
import Service from '../models/Service';
import Payout, { PayoutStatus } from '../models/Payout';
import { AuthRequest } from '../middleware/auth';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalCustomers = await User.countDocuments({ role: UserRole.CUSTOMER });
    const totalProviders = await User.countDocuments({ role: UserRole.PROVIDER });
    const pendingProviders = await User.countDocuments({ 
      role: UserRole.PROVIDER, 
      providerStatus: ProviderStatus.PENDING 
    });
    
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ isActive: true });

    // Calculate revenue
    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalCommission: { $sum: '$commissionAmount' }
        }
      }
    ]);

    const revenue = revenueData[0] || { totalRevenue: 0, totalCommission: 0 };

    res.json({
      success: true,
      stats: {
        users: {
          totalCustomers,
          totalProviders,
          pendingProviders
        },
        bookings: {
          total: totalBookings,
          completed: completedBookings,
          pending: pendingBookings
        },
        services: {
          total: totalServices,
          active: activeServices
        },
        revenue: {
          total: revenue.totalRevenue,
          commission: revenue.totalCommission
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;

    const query: any = {};
    if (role) query.role = role;
    if (status) query.providerStatus = status;

    const users = await User.find(query)
      .select('-password')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
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

// @desc    Update provider status
// @route   PUT /api/admin/providers/:id/status
// @access  Private (Admin)
export const updateProviderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    const provider = await User.findById(req.params.id);

    if (!provider || provider.role !== UserRole.PROVIDER) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    provider.providerStatus = status;
    await provider.save();

    res.json({ 
      success: true, 
      message: `Provider status updated to ${status}`,
      provider
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private (Admin)
export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query: any = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('customerId', 'name email phone')
      .populate('providerId', 'name email phone')
      .populate('serviceId', 'title category')
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

// @desc    Get all payout requests
// @route   GET /api/admin/payouts
// @access  Private (Admin)
export const getAllPayouts = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query: any = {};
    if (status) query.status = status;

    const payouts = await Payout.find(query)
      .populate('providerId', 'name email phone')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Payout.countDocuments(query);

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

// @desc    Update payout status
// @route   PUT /api/admin/payouts/:id
// @access  Private (Admin)
export const updatePayoutStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, notes } = req.body;

    const payout = await Payout.findById(req.params.id);

    if (!payout) {
      return res.status(404).json({ message: 'Payout not found' });
    }

    payout.status = status;
    if (notes) payout.notes = notes;
    
    if (status === PayoutStatus.COMPLETED) {
      payout.processedDate = new Date();
    }

    // If rejected, refund to provider wallet
    if (status === PayoutStatus.REJECTED) {
      const provider = await User.findById(payout.providerId);
      if (provider) {
        provider.wallet = (provider.wallet || 0) + payout.amount;
        await provider.save();
      }
    }

    await payout.save();

    res.json({ success: true, payout });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
