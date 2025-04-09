import { createAsyncThunk } from '@reduxjs/toolkit';
import { setJobs, setLoading, setError } from '../slices/jobSearchSlice';

export const searchJobsThunk = createAsyncThunk(
  'jobSearch/searchJobs',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // TODO: Implement actual API call
      const mockJobs = [
        {
          id: '1',
          title: 'Software Engineer',
          company: 'Tech Corp',
          location: 'Remote',
          type: 'Full-time',
          description: 'Looking for a skilled software engineer...',
          salary: '$100,000 - $150,000',
          postedDate: '2024-03-20',
        },
      ];
      dispatch(setJobs(mockJobs));
      return mockJobs;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to search jobs'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const applyToJobThunk = createAsyncThunk(
  'jobSearch/applyToJob',
  async (jobId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      return jobId;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to apply to job'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
); 