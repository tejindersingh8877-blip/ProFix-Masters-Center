import mongoose, { Schema, Document } from 'mongoose';

export enum PayoutStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

export interface IPayout extends Document {
  providerId: mongoose.Types.ObjectId;
  amount: number;
  status: PayoutStatus;
  requestDate: Date;
  processedDate?: Date;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolderName: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const payoutSchema = new Schema<IPayout>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { 
      type: String, 
      enum: Object.values(PayoutStatus), 
      default: PayoutStatus.PENDING 
    },
    requestDate: { type: Date, default: Date.now },
    processedDate: { type: Date },
    bankDetails: {
      accountNumber: { type: String },
      bankName: { type: String },
      ifscCode: { type: String },
      accountHolderName: { type: String }
    },
    notes: { type: String }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
payoutSchema.index({ providerId: 1, createdAt: -1 });
payoutSchema.index({ status: 1 });

export default mongoose.model<IPayout>('Payout', payoutSchema);
