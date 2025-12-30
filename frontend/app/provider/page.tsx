'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ProviderDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    wallet: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'provider') {
        router.push('/');
        return;
      }
      fetchStats();
    }
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      const bookingsResponse = await api.get('/bookings');
      const bookings = bookingsResponse.data.bookings;
      
      const stats = {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
        completedBookings: bookings.filter((b: any) => b.status === 'completed').length,
        totalEarnings: user?.totalEarnings || 0,
        wallet: user?.wallet || 0,
      };
      
      setStats(stats);
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
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Total Bookings</p>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalBookings}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Pending Bookings</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Completed Bookings</p>
            <p className="text-3xl font-bold text-green-600">{stats.completedBookings}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Wallet Balance</p>
            <p className="text-3xl font-bold text-purple-600">₹{stats.wallet.toFixed(2)}</p>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Earnings Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Available for Payout</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.wallet.toFixed(2)}</p>
              <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
                Request Payout
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Bookings</h3>
            <p className="text-gray-600 mb-4">View and manage your service bookings</p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
              View Bookings
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">My Services</h3>
            <p className="text-gray-600 mb-4">Add or edit your services</p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
              Manage Services
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Profile</h3>
            <p className="text-gray-600 mb-4">Update your profile and skills</p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Provider Status */}
        {user?.providerStatus && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Status</h2>
            <div className="flex items-center space-x-3">
              <span className="text-gray-700">Verification Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.providerStatus === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : user.providerStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {user.providerStatus.toUpperCase()}
              </span>
            </div>
            {user.providerStatus === 'pending' && (
              <p className="text-gray-600 mt-4">
                Your account is under review. You'll be able to receive bookings once approved.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
