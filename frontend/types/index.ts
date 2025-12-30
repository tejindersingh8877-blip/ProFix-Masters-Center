export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'provider' | 'admin';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profilePhoto?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  providerStatus?: 'pending' | 'approved' | 'rejected' | 'suspended';
  experience?: number;
  skills?: string[];
  serviceAreas?: string[];
  wallet?: number;
  totalEarnings?: number;
  rating?: number;
  totalReviews?: number;
}

export interface Service {
  _id: string;
  providerId: User;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  images?: string[];
  duration?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  customerId: User;
  providerId: User;
  serviceId: Service;
  bookingDate: string;
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
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  paymentMethod: 'card' | 'wallet' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'refunded' | 'failed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  bookingId: string;
  customerId: User;
  providerId: User;
  serviceId: Service;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Payout {
  _id: string;
  providerId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestDate: string;
  processedDate?: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolderName: string;
  };
  notes?: string;
}
