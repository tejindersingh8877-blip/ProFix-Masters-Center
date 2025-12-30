import mongoose, { Schema, Document } from 'mongoose';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

export enum PaymentMethod {
  CARD = 'card',
  WALLET = 'wallet',
  COD = 'cod'
}

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  
  bookingDate: Date;
  bookingTime: string;
  
  customerAddress: string;
  customerCity: string;
  customerZipCode?: string;
  customerPhone: string;
  
  servicePrice: number;
  commissionRate: number;
  commissionAmount: number;
  providerEarning: number;
  totalAmount: number;
  
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  
  notes?: string;
  cancellationReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    
    bookingDate: { type: Date, required: true },
    bookingTime: { type: String, required: true },
    
    customerAddress: { type: String, required: true },
    customerCity: { type: String, required: true },
    customerZipCode: { type: String },
    customerPhone: { type: String, required: true },
    
    servicePrice: { type: Number, required: true },
    commissionRate: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
    providerEarning: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    
    status: { 
      type: String, 
      enum: Object.values(BookingStatus), 
      default: BookingStatus.PENDING 
    },
    paymentMethod: { 
      type: String, 
      enum: Object.values(PaymentMethod), 
      required: true 
    },
    paymentStatus: { 
      type: String, 
      enum: Object.values(PaymentStatus), 
      default: PaymentStatus.PENDING 
    },
    paymentTransactionId: { type: String },
    
    notes: { type: String },
    cancellationReason: { type: String }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ providerId: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);
