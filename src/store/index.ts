import { configureStore } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  linkedInProfile: string;
  resume: any;
  skills: string[];
}

interface JobApplication {
  id: string;
  jobId: string;
  status: 'pending' | 'submitted' | 'failed';
  coverLetter: string;
  customizedResume: any;
  matchScore: number;
}

interface ApplicationState {
  userProfile: UserProfile | null;
  applications: JobApplication[];
  isAuthenticated: boolean;
  aiSuggestions: any;
}

// Initial state
const initialState: ApplicationState = {
  userProfile: null,
  applications: [],
  isAuthenticated: false,
  aiSuggestions: null,
};

// Application slice
const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.userProfile = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    addApplication: (state, action: PayloadAction<JobApplication>) => {
      state.applications.push(action.payload);
    },
    updateApplication: (state, action: PayloadAction<JobApplication>) => {
      const index = state.applications.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
    },
    setAISuggestions: (state, action: PayloadAction<any>) => {
      state.aiSuggestions = action.payload;
    },
  },
});

// Export actions
export const {
  setUserProfile,
  setAuthenticated,
  addApplication,
  updateApplication,
  setAISuggestions,
} = applicationSlice.actions;

// Configure store
export const store = configureStore({
  reducer: {
    application: applicationSlice.reducer,
  },
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 