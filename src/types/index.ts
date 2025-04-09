export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  applicationStatus: string;
}

export interface JobSearchParams {
  keywords: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salary: string;
}

export interface JobSearchFormProps {
  onSearch: (params: JobSearchParams) => void;
  isSearching: boolean;
}

export interface JobListProps {
  jobs: Job[];
}

export interface JobCardProps {
  job: Job;
} 