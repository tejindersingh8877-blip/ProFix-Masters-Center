import express from 'express';
import {
  register,
  login,
  sendOTP,
  verifyOTPController,
  getMe
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', protect, sendOTP);
router.post('/verify-otp', protect, verifyOTPController);
router.get('/me', protect, getMe);

export default router;
