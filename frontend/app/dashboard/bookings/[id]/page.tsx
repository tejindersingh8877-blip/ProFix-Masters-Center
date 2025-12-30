'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Booking } from '@/types';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchBooking();
  }, [params.id, user]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${params.id}`);
      setBooking(response.data.booking);
    } catch (error) {
      console.error('Failed to fetch booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.put(`/bookings/${params.id}/cancel`, {
        cancellationReason: 'Customer requested cancellation',
      });
      fetchBooking();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        bookingId: params.id,
        ...reviewData,
      });
      alert('Review submitted successfully!');
      setShowReview(false);
      fetchBooking();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Booking not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking Details</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {booking.serviceId.title}
            </h2>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Service Details</h3>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Category:</span>{' '}
                {booking.serviceId.category.replace('_', ' ').toUpperCase()}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Provider:</span>{' '}
                {booking.providerId.name}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Date:</span>{' '}
                {new Date(booking.bookingDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Time:</span> {booking.bookingTime}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
              <p className="text-gray-600 mb-2">{booking.customerAddress}</p>
              <p className="text-gray-600 mb-2">{booking.customerCity}</p>
              {booking.customerZipCode && (
                <p className="text-gray-600 mb-2">{booking.customerZipCode}</p>
              )}
              <p className="text-gray-600">Phone: {booking.customerPhone}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Service Price:</span>
                <span>₹{booking.servicePrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Fee:</span>
                <span>₹{booking.commissionAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t">
                <span>Total Amount:</span>
                <span>₹{booking.totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Method:</span>
                <span className="uppercase">{booking.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Status:</span>
                <span className="capitalize">{booking.paymentStatus}</span>
              </div>
            </div>
          </div>

          {booking.notes && (
            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-600">{booking.notes}</p>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            {booking.status === 'pending' && user?.role === 'customer' && (
              <button
                onClick={handleCancelBooking}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition"
              >
                Cancel Booking
              </button>
            )}

            {booking.status === 'completed' && user?.role === 'customer' && (
              <button
                onClick={() => setShowReview(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Write Review
              </button>
            )}
          </div>
        </div>

        {/* Review Form */}
        {showReview && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`text-3xl ${
                        star <= reviewData.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowReview(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
