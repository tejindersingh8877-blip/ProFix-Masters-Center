import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
