'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Service, Review } from '@/types';
import Link from 'next/link';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchService();
      fetchReviews();
    }
  }, [params.id]);

  const fetchService = async () => {
    try {
      const response = await api.get(`/services/${params.id}`);
      setService(response.data.service);
    } catch (error) {
      console.error('Failed to fetch service:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/provider/${service?.providerId._id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      router.push(`/auth/login?redirect=/services/${params.id}/book`);
      return;
    }
    router.push(`/services/${params.id}/book`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h2>
          <Link href="/services" className="text-indigo-600 hover:text-indigo-700">
            Back to services
          </Link>
        </div>
      </div>
    );
  }

  const provider = service.providerId;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-9xl">🔧</div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                    {service.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-3xl font-bold text-indigo-600">₹{service.basePrice}</span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>
                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-sm text-gray-500">Duration:</span>
                  <span className="text-sm font-medium text-gray-900">{service.duration} minutes</span>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-md mt-8 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-bold">
                            {review.customerId.name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{review.customerId.name}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Provider Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Service Provider</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  {provider.profilePhoto ? (
                    <img
                      src={provider.profilePhoto}
                      alt={provider.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-2xl font-bold">{provider.name[0]}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{provider.name}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600 ml-1">
                      {provider.rating?.toFixed(1) || 'New'} ({provider.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {provider.experience && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Experience:</span> {provider.experience} years
                </p>
              )}

              {provider.city && (
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Location:</span> {provider.city}
                </p>
              )}

              {provider.skills && provider.skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {provider.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              className="w-full bg-indigo-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
