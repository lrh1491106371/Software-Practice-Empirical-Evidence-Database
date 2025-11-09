'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary-600">
              SPEED
            </Link>
            <div className="flex space-x-4">
              <Link href="/search" className="text-gray-700 hover:text-primary-600">
                Search
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/submit" className="text-gray-700 hover:text-primary-600">
                    Submit
                  </Link>
                  {hasRole('moderator') && (
                    <Link href="/moderate" className="text-gray-700 hover:text-primary-600">
                      Moderate
                    </Link>
                  )}
                  {hasRole('analyst') && (
                    <Link href="/analyze" className="text-gray-700 hover:text-primary-600">
                      Analyze
                    </Link>
                  )}
                  {hasRole('admin') && (
                    <Link href="/admin" className="text-gray-700 hover:text-primary-600">
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

