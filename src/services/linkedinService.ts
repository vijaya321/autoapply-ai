import { getSession } from 'next-auth/react';
import { Job } from '@/types/job';
import * as cheerio from 'cheerio';

interface JobSearchParams {
  keywords?: string;
  location?: string;
  jobType?: string;
  experience?: string;
  salary?: string;
  industries?: string[];
}

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
  postedDate: string;
  applyUrl: string;
}

interface LinkedInJobSearchParams {
  keywords?: string;
  location?: string;
  jobType?: string;
  experience?: string;
  timePosted?: string;
  sortBy?: string;
  start?: number;
}

interface LinkedInJobResponse {
  jobs: Job[];
  totalResults: number;
  error?: string;
}

export const searchJobs = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error('No access token available');
    }

    // Construct the search query
    const searchQuery = {
      keywords: params.keywords || '',
      location: params.location || '',
      jobType: params.jobType || '',
      experience: params.experience || '',
      salary: params.salary || '',
      industries: params.industries || [],
    };

    // Make the API request to LinkedIn
    const response = await fetch('https://api.linkedin.com/v2/jobs/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchQuery),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs from LinkedIn');
    }

    const data = await response.json();
    
    // Transform the LinkedIn API response into our JobListing format
    return data.elements.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company.name,
      location: job.location,
      type: job.employmentType,
      description: job.description,
      salary: job.salary?.range ? `${job.salary.range.min} - ${job.salary.range.max}` : undefined,
      postedDate: new Date(job.postedDate).toLocaleDateString(),
      applyUrl: job.applyUrl,
    }));
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
};

export const applyToJob = async (jobId: string): Promise<void> => {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error('No access token available');
    }

    // Make the API request to apply for the job
    const response = await fetch(`https://api.linkedin.com/v2/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Add any required application data here
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to apply for the job');
    }
  } catch (error) {
    console.error('Error applying to job:', error);
    throw error;
  }
};

export async function searchLinkedInJobs(params: LinkedInJobSearchParams): Promise<LinkedInJobResponse> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.keywords) queryParams.append('keywords', params.keywords);
    if (params.location) queryParams.append('location', params.location);
    if (params.jobType) queryParams.append('f_JT', params.jobType);
    if (params.experience) queryParams.append('f_E', params.experience);
    if (params.timePosted) queryParams.append('f_TPR', params.timePosted);
    if (params.start) queryParams.append('start', params.start.toString());
    
    // Call LinkedIn's public jobs API
    const response = await fetch(
      `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?${queryParams.toString()}`,
      {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    
    // Parse the HTML response to extract job data
    const jobs = parseLinkedInJobsHtml(html);
    
    return {
      jobs,
      totalResults: jobs.length,
    };
  } catch (error) {
    console.error('Error searching LinkedIn jobs:', error);
    return {
      jobs: [],
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Failed to search jobs'
    };
  }
}

function parseLinkedInJobsHtml(html: string): Job[] {
  const jobs: Job[] = [];
  
  try {
    // Load HTML with cheerio
    const $ = cheerio.load(html);
    
    // Find all job cards
    $('.base-card').each((index: number, element: cheerio.Element) => {
      try {
        const $card = $(element);
        const id = $card.attr('data-job-id') || generateRandomId();
        const title = $card.find('.base-search-card__title').text().trim();
        const company = $card.find('.base-search-card__subtitle').text().trim();
        const location = $card.find('.job-search-card__location').text().trim();
        const salary = $card.find('.job-search-card__salary-info').text().trim() || 'Salary not specified';
        const description = $card.find('.base-search-card__metadata').text().trim();
        const listingUrl = $card.find('a.base-card__full-link').attr('href') || '';
        
        if (title && company) { // Only add jobs with at least title and company
          jobs.push({
            id,
            title,
            company,
            location,
            description,
            salary,
            url: listingUrl.startsWith('http') ? listingUrl : `https://www.linkedin.com${listingUrl}`,
            applicationStatus: 'not_applied'
          });
        }
      } catch (error) {
        console.error('Error parsing job card:', error);
      }
    });
  } catch (error) {
    console.error('Error parsing LinkedIn jobs HTML:', error);
  }
  
  return jobs;
}

function generateRandomId(): string {
  return Math.random().toString(36).substring(7);
}

// Helper function to format job type parameter
export function formatJobType(type: string): string {
  const jobTypes: { [key: string]: string } = {
    'full-time': 'F',
    'part-time': 'P',
    'contract': 'C',
    'temporary': 'T',
    'volunteer': 'V',
    'internship': 'I',
  };
  
  return jobTypes[type.toLowerCase()] || '';
}

// Helper function to format experience level parameter
export function formatExperienceLevel(level: string): string {
  const experienceLevels: { [key: string]: string } = {
    'internship': '1',
    'entry': '2',
    'associate': '3',
    'mid-senior': '4',
    'director': '5',
    'executive': '6',
  };
  
  return experienceLevels[level.toLowerCase()] || '';
}

// Helper function to format time posted parameter
export function formatTimePosted(time: string): string {
  const timeFilters: { [key: string]: string } = {
    '24h': 'r86400',
    'week': 'r604800',
    'month': 'r2592000',
  };
  
  return timeFilters[time.toLowerCase()] || '';
} 