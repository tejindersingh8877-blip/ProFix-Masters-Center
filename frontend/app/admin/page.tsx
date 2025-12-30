'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchStats();
    }
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform Overview and Management</p>
        </div>

        {/* User Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Total Customers</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.users.totalCustomers || 0}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Total Providers</p>
              <p className="text-3xl font-bold text-green-600">
                {stats?.users.totalProviders || 0}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats?.users.pendingProviders || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Total Bookings</p>
              <p className="text-3xl font-bold text-purple-600">
                {stats?.bookings.total || 0}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {stats?.bookings.completed || 0}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats?.bookings.pending || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-indigo-600">
                ₹{stats?.revenue.total?.toFixed(2) || 0}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Platform Commission</p>
              <p className="text-3xl font-bold text-green-600">
                ₹{stats?.revenue.commission?.toFixed(2) || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Service Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Service Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Total Services</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.services.total || 0}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Active Services</p>
              <p className="text-3xl font-bold text-green-600">
                {stats?.services.active || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Users</h3>
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition text-sm">
              View Users
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Approve Providers</h3>
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition text-sm">
              View Pending
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">All Bookings</h3>
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition text-sm">
              View Bookings
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Payouts</h3>
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition text-sm">
              Manage Payouts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
