import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  CUSTOMER = 'customer',
  PROVIDER = 'provider',
  ADMIN = 'admin'
}

export enum ProviderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profilePhoto?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  
  // Provider specific fields
  providerStatus?: ProviderStatus;
  experience?: number;
  skills?: string[];
  serviceAreas?: string[];
  certificates?: string[];
  idProof?: string;
  wallet?: number;
  totalEarnings?: number;
  rating?: number;
  totalReviews?: number;
  availability?: Map<string, boolean>;
  
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    profilePhoto: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    
    // Provider specific
    providerStatus: { 
      type: String, 
      enum: Object.values(ProviderStatus),
      default: ProviderStatus.PENDING 
    },
    experience: { type: Number },
    skills: [{ type: String }],
    serviceAreas: [{ type: String }],
    certificates: [{ type: String }],
    idProof: { type: String },
    wallet: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    availability: { type: Map, of: Boolean }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUser>('User', userSchema);
