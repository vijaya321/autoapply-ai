'use client';

import { useState } from 'react';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: 'applied' | 'interviewing' | 'rejected' | 'accepted';
  appliedDate: string;
}

const RecentApplications: React.FC = () => {
  // This will be replaced with actual API calls later
  const [applications] = useState<Application[]>([
    {
      id: '1',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Corp',
      status: 'applied',
      appliedDate: '2024-03-15',
    },
    {
      id: '2',
      jobTitle: 'Full Stack Developer',
      company: 'StartUp Inc',
      status: 'interviewing',
      appliedDate: '2024-03-14',
    },
    {
      id: '3',
      jobTitle: 'Frontend Engineer',
      company: 'Web Solutions',
      status: 'rejected',
      appliedDate: '2024-03-13',
    },
  ]);

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {applications.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No recent applications</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {applications.map((application) => (
            <div key={application.id} className="py-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{application.jobTitle}</h3>
                <p className="text-sm text-gray-500">{application.company}</p>
                <p className="text-xs text-gray-400">Applied on {new Date(application.appliedDate).toLocaleDateString()}</p>
              </div>
              <div className="ml-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentApplications; 