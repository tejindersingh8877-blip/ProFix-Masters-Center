'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-indigo-600">ProFix</div>
              <div className="text-xl font-semibold text-gray-800">Masters</div>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              href="/services"
              className={`${
                pathname === '/services' ? 'text-indigo-600' : 'text-gray-700'
              } hover:text-indigo-600 font-medium`}
            >
              Services
            </Link>

            {user ? (
              <>
                {user.role === 'customer' && (
                  <Link
                    href="/dashboard"
                    className={`${
                      pathname?.startsWith('/dashboard') ? 'text-indigo-600' : 'text-gray-700'
                    } hover:text-indigo-600 font-medium`}
                  >
                    My Bookings
                  </Link>
                )}

                {user.role === 'provider' && (
                  <Link
                    href="/provider"
                    className={`${
                      pathname?.startsWith('/provider') ? 'text-indigo-600' : 'text-gray-700'
                    } hover:text-indigo-600 font-medium`}
                  >
                    Provider Dashboard
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`${
                      pathname?.startsWith('/admin') ? 'text-indigo-600' : 'text-gray-700'
                    } hover:text-indigo-600 font-medium`}
                  >
                    Admin Panel
                  </Link>
                )}

                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Hi, {user.name}</span>
                  <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
