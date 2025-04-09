'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import JobSearchForm from './JobSearchForm';
import JobList from './JobList';
import JobPreferences from './JobPreferences';
import ApplicationStats from './ApplicationStats';
import LinkedInAuth from './LinkedInAuth';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  applicationStatus: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Handle loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to AutoApply AI
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to start automating your job search
            </p>
          </div>
          <div className="mt-8">
            <LinkedInAuth />
          </div>
        </div>
      </div>
    );
  }

  const handleSearch = async (searchParams: any) => {
    setIsSearching(true);
    try {
      // TODO: Implement actual LinkedIn API integration
      const mockResults: Job[] = [
        {
          id: '1',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          location: 'Remote',
          description: 'Looking for an experienced software engineer...',
          salary: '$120,000 - $180,000',
          applicationStatus: 'Not Applied'
        },
        {
          id: '2',
          title: 'Full Stack Developer',
          company: 'Startup Inc',
          location: 'San Francisco, CA',
          description: 'Join our fast-growing team...',
          salary: '$100,000 - $150,000',
          applicationStatus: 'Not Applied'
        }
      ];
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Message */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {session.user?.name}!
            </h1>
            <p className="mt-2 text-gray-600">
              Let's find and apply to your next opportunity.
            </p>
          </div>

          {/* Job Search Form */}
          <div className="bg-white rounded-lg shadow">
            <JobSearchForm onSearch={handleSearch} isSearching={isSearching} />
          </div>

          {/* Job Listings */}
          <div className="bg-white rounded-lg shadow">
            <JobList jobs={searchResults} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Preferences */}
          <div className="bg-white rounded-lg shadow">
            <JobPreferences />
          </div>

          {/* Application Stats */}
          <div className="bg-white rounded-lg shadow">
            <ApplicationStats />
          </div>
        </div>
      </div>
    </div>
  );
} 