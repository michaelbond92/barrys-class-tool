import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { UserMenu, LoginForm } from '../auth/LoginForm';
import { isFirebaseConfigured } from '../../services/firebase/firebaseConfig';

export function Header() {
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const firebaseEnabled = isFirebaseConfigured();

  return (
    <>
      <header className="bg-header text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-header font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Barry's Class Tool</h1>
                <p className="text-orange-100 text-sm">Class Programming Made Easy</p>
              </div>
            </div>

            {/* Auth section */}
            {firebaseEnabled && (
              <div className="flex items-center gap-3">
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-orange-400 animate-pulse" />
                ) : user ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <LoginForm onSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}
