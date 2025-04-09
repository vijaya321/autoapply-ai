import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary: string;
  postedDate: string;
}

interface JobSearchState {
  jobs: JobListing[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  location: string;
  jobType: string;
  experience: string;
  salary: string;
  industries: string[];
}

const initialState: JobSearchState = {
  jobs: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  location: '',
  jobType: '',
  experience: '',
  salary: '',
  industries: [],
};

const jobSearchSlice = createSlice({
  name: 'jobSearch',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setJobType: (state, action: PayloadAction<string>) => {
      state.jobType = action.payload;
    },
    setExperience: (state, action: PayloadAction<string>) => {
      state.experience = action.payload;
    },
    setSalary: (state, action: PayloadAction<string>) => {
      state.salary = action.payload;
    },
    setIndustries: (state, action: PayloadAction<string[]>) => {
      state.industries = action.payload;
    },
    setJobs: (state, action: PayloadAction<JobListing[]>) => {
      state.jobs = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setLocation,
  setJobType,
  setExperience,
  setSalary,
  setIndustries,
  setJobs,
  setLoading,
  setError,
} = jobSearchSlice.actions;

export default jobSearchSlice.reducer; 