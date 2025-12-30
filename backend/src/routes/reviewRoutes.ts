import express from 'express';
import {
  createReview,
  getProviderReviews,
  getReviewByBooking
} from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/provider/:providerId', getProviderReviews);
router.get('/booking/:bookingId', protect, getReviewByBooking);

export default router;
