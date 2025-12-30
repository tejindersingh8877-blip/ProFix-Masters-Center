import mongoose, { Schema, Document } from 'mongoose';

export enum ServiceCategory {
  AC_REPAIR = 'ac_repair',
  AC_CLEANING = 'ac_cleaning',
  HOUSE_CLEANING = 'house_cleaning',
  HOME_MAINTENANCE = 'home_maintenance',
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  PAINTING = 'painting'
}

export interface IService extends Document {
  providerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  images?: string[];
  duration?: number; // in minutes
  isActive: boolean;
  customCommissionRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      enum: Object.values(ServiceCategory), 
      required: true 
    },
    basePrice: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    duration: { type: Number, default: 60 },
    isActive: { type: Boolean, default: true },
    customCommissionRate: { type: Number, min: 0, max: 1 }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ providerId: 1 });

export default mongoose.model<IService>('Service', serviceSchema);
