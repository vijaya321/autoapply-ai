'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Layout from './Layout';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <Layout>{children}</Layout>
      </Provider>
    </SessionProvider>
  );
} 