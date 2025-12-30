import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateProviderStatus,
  getAllBookings,
  getAllPayouts,
  updatePayoutStatus
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

router.use(protect);
router.use(authorize(UserRole.ADMIN));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/providers/:id/status', updateProviderStatus);
router.get('/bookings', getAllBookings);
router.get('/payouts', getAllPayouts);
router.put('/payouts/:id', updatePayoutStatus);

export default router;
