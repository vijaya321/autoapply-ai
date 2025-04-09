'use client';

import React, { useState } from 'react';

interface JobPreferences {
  desiredTitle: string;
  minSalary: string;
  maxSalary: string;
  preferredLocations: string[];
  remotePreference: string;
  industries: string[];
  yearsOfExperience: string;
  skills: string[];
}

export default function JobPreferences() {
  const [preferences, setPreferences] = useState<JobPreferences>({
    desiredTitle: '',
    minSalary: '',
    maxSalary: '',
    preferredLocations: [],
    remotePreference: 'no_preference',
    industries: [],
    yearsOfExperience: '',
    skills: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !preferences.skills.includes(newSkill.trim())) {
      setPreferences(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setPreferences(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const addLocation = () => {
    if (newLocation.trim() && !preferences.preferredLocations.includes(newLocation.trim())) {
      setPreferences(prev => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, newLocation.trim()],
      }));
      setNewLocation('');
    }
  };

  const removeLocation = (locationToRemove: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter(location => location !== locationToRemove),
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Job Preferences</h2>
        <button
          type="button"
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          {isEditing ? 'Save Changes' : 'Edit'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Desired Title */}
        <div>
          <label htmlFor="desiredTitle" className="block text-sm font-medium text-gray-700">
            Desired Job Title
          </label>
          <input
            type="text"
            id="desiredTitle"
            value={preferences.desiredTitle}
            onChange={(e) => setPreferences(prev => ({ ...prev, desiredTitle: e.target.value }))}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="e.g., Software Engineer"
          />
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700">
              Minimum Salary
            </label>
            <input
              type="text"
              id="minSalary"
              value={preferences.minSalary}
              onChange={(e) => setPreferences(prev => ({ ...prev, minSalary: e.target.value }))}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="$"
            />
          </div>
          <div>
            <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700">
              Maximum Salary
            </label>
            <input
              type="text"
              id="maxSalary"
              value={preferences.maxSalary}
              onChange={(e) => setPreferences(prev => ({ ...prev, maxSalary: e.target.value }))}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="$"
            />
          </div>
        </div>

        {/* Remote Preference */}
        <div>
          <label htmlFor="remotePreference" className="block text-sm font-medium text-gray-700">
            Remote Work Preference
          </label>
          <select
            id="remotePreference"
            value={preferences.remotePreference}
            onChange={(e) => setPreferences(prev => ({ ...prev, remotePreference: e.target.value }))}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="no_preference">No Preference</option>
            <option value="remote_only">Remote Only</option>
            <option value="hybrid">Hybrid</option>
            <option value="office">Office Based</option>
          </select>
        </div>

        {/* Preferred Locations */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Locations</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              disabled={!isEditing}
              className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Add a location"
            />
            <button
              type="button"
              onClick={addLocation}
              disabled={!isEditing}
              className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {preferences.preferredLocations.map((location) => (
              <span
                key={location}
                className="inline-flex items-center rounded-full bg-indigo-100 py-1 pl-2.5 pr-1 text-sm font-medium text-indigo-700"
              >
                {location}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeLocation(location)}
                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                  >
                    <span className="sr-only">Remove {location}</span>
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              disabled={!isEditing}
              className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Add a skill"
            />
            <button
              type="button"
              onClick={addSkill}
              disabled={!isEditing}
              className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {preferences.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full bg-indigo-100 py-1 pl-2.5 pr-1 text-sm font-medium text-indigo-700"
              >
                {skill}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                  >
                    <span className="sr-only">Remove {skill}</span>
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 