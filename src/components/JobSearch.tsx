'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Job } from '@/types/job';
import { applyToJob } from '@/services/applicationService';
import { searchLinkedInJobs, formatJobType, formatExperienceLevel, formatTimePosted } from '@/services/linkedinService';
import { toast } from 'react-hot-toast';

const JobSearch: React.FC = () => {
  const { data: session, status } = useSession();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    keywords: '',
    location: '',
    jobType: 'all',
    experienceLevel: 'any',
    timePosted: 'any',
  });

  // Debug session status
  useEffect(() => {
    console.log('Auth Status:', status);
    console.log('Session Data:', {
      isAuthenticated: !!session,
      user: session?.user,
      hasAccessToken: !!(session as any)?.accessToken,
    });
  }, [session, status]);

  const searchJobs = async () => {
    console.log('Starting job search with filters:', filters);
    setIsSearching(true);
    try {
      const response = await searchLinkedInJobs({
        keywords: filters.keywords,
        location: filters.location,
        jobType: formatJobType(filters.jobType),
        experience: formatExperienceLevel(filters.experienceLevel),
        timePosted: formatTimePosted(filters.timePosted),
      });

      if (response.error) {
        toast.error(response.error);
        return;
      }

      console.log('Found jobs:', response.jobs);
      setSearchResults(response.jobs);
      
      if (response.jobs.length === 0) {
        toast('No jobs found matching your criteria. Try adjusting your filters.');
      } else {
        toast.success(`Found ${response.jobs.length} jobs matching your criteria.`);
      }
    } catch (error) {
      console.error('Error searching jobs:', error);
      toast.error('Failed to search jobs. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Function to handle applying to a single job
  const handleApplyToJob = async (job: Job) => {
    console.log('Starting application process for job:', job);
    
    if (!session) {
      console.error('No session found. User must be logged in.');
      toast.error('Please sign in to apply for jobs');
      return;
    }

    if (!session.accessToken) {
      console.error('No access token found in session');
      toast.error('Authentication token missing. Please sign in again.');
      return;
    }

    setIsApplying(true);
    setCurrentJobId(job.id);

    try {
      console.log('Calling applyToJob service with:', {
        jobId: job.id,
        hasSession: !!session,
        hasAccessToken: !!(session as any).accessToken,
        user: session.user
      });

      const response = await applyToJob(job, session);
      console.log('Application response:', response);
      
      if (response.success) {
        toast.success(`Successfully applied to ${job.title} at ${job.company}`);
        
        // Update the job status in the search results
        setSearchResults(prev =>
          prev.map(j =>
            j.id === job.id
              ? { ...j, applicationStatus: 'applied', applicationId: response.applicationId }
              : j
          )
        );
      } else {
        console.error('Application failed:', response.message, response.error);
        toast.error(response.message || 'Failed to apply. Please try again.');
      }
    } catch (error) {
      console.error('Error in handleApplyToJob:', error);
      toast.error('Failed to apply. Please try again.');
    } finally {
      setIsApplying(false);
      setCurrentJobId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Job Title or Keywords"
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.keywords}
          onChange={(e) => setFilters(prev => ({ ...prev, keywords: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Location"
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.location}
          onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
        />
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.jobType}
          onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
        >
          <option value="all">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="temporary">Temporary</option>
          <option value="internship">Internship</option>
        </select>
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.experienceLevel}
          onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
        >
          <option value="any">Any Level</option>
          <option value="internship">Internship</option>
          <option value="entry">Entry Level</option>
          <option value="associate">Associate</option>
          <option value="mid-senior">Mid-Senior Level</option>
          <option value="director">Director</option>
          <option value="executive">Executive</option>
        </select>
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={filters.timePosted}
          onChange={(e) => setFilters(prev => ({ ...prev, timePosted: e.target.value }))}
        >
          <option value="any">Any Time</option>
          <option value="24h">Past 24 hours</option>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={searchJobs}
          disabled={isSearching}
          className={`inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSearching ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSearching ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            'Search Jobs'
          )}
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Search Results</h2>
          <div className="space-y-4">
            {searchResults.map(job => (
              <div key={job.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.applicationStatus === 'applied' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.applicationStatus === 'applied' ? 'Applied' : 'Not Applied'}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{job.location}</p>
                  <p className="text-sm text-gray-500">{job.salary}</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">{job.description}</p>
                <div className="mt-4 flex space-x-4">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View on LinkedIn
                  </a>
                  <button
                    onClick={() => handleApplyToJob(job)}
                    disabled={isApplying && currentJobId === job.id || job.applicationStatus === 'applied'}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      (isApplying && currentJobId === job.id) || job.applicationStatus === 'applied'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {isApplying && currentJobId === job.id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Applying...
                      </>
                    ) : job.applicationStatus === 'applied' ? (
                      'Applied'
                    ) : (
                      'Apply Now'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch; 