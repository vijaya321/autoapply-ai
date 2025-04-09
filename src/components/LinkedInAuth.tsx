'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LinkedInAuth: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLinkedInLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn('linkedin', {
        redirect: true,
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        setError('Failed to sign in with LinkedIn. Please try again.');
        console.error('Sign in error:', result.error);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleLinkedInLogin}
        disabled={isLoading}
        className={`flex items-center space-x-2 bg-[#0077B5] text-white px-6 py-3 rounded-lg hover:bg-[#006097] transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
        <span>{isLoading ? 'Signing in...' : 'Sign in with LinkedIn'}</span>
      </button>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <p className="text-sm text-gray-600">
        We'll use your LinkedIn profile to automate your job applications
      </p>
    </div>
  );
};

export default LinkedInAuth; 