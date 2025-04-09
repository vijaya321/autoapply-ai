'use client';

import React from 'react';
import Layout from '../../components/Layout';

export default function Applications() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <div className="mt-6">
            <p className="text-gray-500">Your job applications will appear here.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 