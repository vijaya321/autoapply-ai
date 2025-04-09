export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  url: string;
  requirements?: string[];
  applicationStatus?: 'not_applied' | 'applied' | 'under_review' | 'interview' | 'rejected' | 'accepted';
  applicationDate?: string;
  applicationId?: string;
} 