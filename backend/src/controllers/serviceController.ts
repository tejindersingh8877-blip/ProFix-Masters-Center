import { Response } from 'express';
import Service from '../models/Service';
import { AuthRequest } from '../middleware/auth';
import { UserRole } from '../models/User';

// @desc    Create service
// @route   POST /api/services
// @access  Private (Provider only)
export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, basePrice, duration, images } = req.body;

    if (req.user.role !== UserRole.PROVIDER) {
      return res.status(403).json({ message: 'Only service providers can create services' });
    }

    const service = await Service.create({
      providerId: req.user._id,
      title,
      description,
      category,
      basePrice,
      duration,
      images
    });

    res.status(201).json({ success: true, service });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req: AuthRequest, res: Response) => {
  try {
    const { category, city, search, page = 1, limit = 10 } = req.query;

    const query: any = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(query)
      .populate('providerId', 'name profilePhoto rating totalReviews city')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      services,
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

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req: AuthRequest, res: Response) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('providerId', 'name profilePhoto rating totalReviews city phone email experience skills');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ success: true, service });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Provider only)
export const updateService = async (req: AuthRequest, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, service: updatedService });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Provider only)
export const deleteService = async (req: AuthRequest, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get provider's services
// @route   GET /api/services/provider/:providerId
// @access  Public
export const getProviderServices = async (req: AuthRequest, res: Response) => {
  try {
    const services = await Service.find({ 
      providerId: req.params.providerId,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({ success: true, services });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
