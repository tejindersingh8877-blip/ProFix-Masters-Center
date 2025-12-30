import express from 'express';
import {
  getProfile,
  updateProfile,
  getProviderById,
  requestPayout,
  getPayouts,
  uploadDocuments
} from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/provider/:id', getProviderById);
router.post('/payout', protect, authorize(UserRole.PROVIDER), requestPayout);
router.get('/payouts', protect, authorize(UserRole.PROVIDER), getPayouts);
router.post('/documents', protect, authorize(UserRole.PROVIDER), uploadDocuments);

export default router;
