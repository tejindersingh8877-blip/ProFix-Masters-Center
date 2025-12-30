import express from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getProviderServices
} from '../controllers/serviceController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

router.post('/', protect, authorize(UserRole.PROVIDER, UserRole.ADMIN), createService);
router.get('/', getServices);
router.get('/:id', getServiceById);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);
router.get('/provider/:providerId', getProviderServices);

export default router;
