'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ApplicationStats from '@/components/ApplicationStats';
import JobPreferences from '@/components/JobPreferences';
import RecentApplications from '@/components/RecentApplications';
import JobSearch from '@/components/JobSearch';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Search Section */}
        <section className="mb-8">
          <JobSearch />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats and Recent Applications */}
          <div className="lg:col-span-2 space-y-8">
            {/* Application Stats */}
            <section className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Statistics</h2>
                <ApplicationStats />
              </div>
            </section>

            {/* Recent Applications */}
            <section className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>
                <RecentApplications />
              </div>
            </section>
          </div>

          {/* Right Column - Job Preferences */}
          <div className="lg:col-span-1">
            <section className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Preferences</h2>
                <JobPreferences />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 