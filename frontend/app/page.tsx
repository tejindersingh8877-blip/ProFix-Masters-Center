'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ServiceCard from '@/components/ui/ServiceCard';
import { Service } from '@/types';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services?limit=6');
      setServices(response.data.services);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      name: 'AC Repair',
      icon: '❄️',
      description: 'Professional AC repair and maintenance',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'AC Cleaning',
      icon: '🌬️',
      description: 'Deep cleaning for your air conditioner',
      color: 'from-green-500 to-teal-500',
    },
    {
      name: 'House Cleaning',
      icon: '🏠',
      description: 'Complete home cleaning services',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Home Maintenance',
      icon: '🔧',
      description: 'Expert home repair and maintenance',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Professional Home Services
              <br />
              At Your Doorstep
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              AC repair, cleaning, and home maintenance services by verified experts
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/services"
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-50 transition"
              >
                Browse Services
              </Link>
              <Link
                href="/auth/register?role=provider"
                className="bg-indigo-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-900 transition"
              >
                Become a Provider
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/services?category=${category.name.toLowerCase().replace(' ', '_')}`}
              >
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition cursor-pointer">
                  <div
                    className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-4xl`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2 text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-center">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Featured Services
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No services available yet.</p>
          )}

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition inline-block"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose ProFix Masters?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Verified Professionals</h3>
              <p className="text-gray-600">
                All service providers are verified and background-checked
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Transparent Pricing</h3>
              <p className="text-gray-600">
                No hidden charges. Pay what you see
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Quality Assured</h3>
              <p className="text-gray-600">
                Rated services with customer reviews and ratings
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
