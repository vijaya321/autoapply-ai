import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { AIService } from '../services/ai';
import { addApplication } from '../store';

interface JobApplicationFormProps {
  jobId: string;
  jobDescription: string;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ jobId, jobDescription }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userProfile = useSelector((state: RootState) => state.application.userProfile);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchAnalysis, setMatchAnalysis] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [customizedResume, setCustomizedResume] = useState<any>(null);

  const aiService = new AIService(process.env.NEXT_PUBLIC_OPENAI_API_KEY || '');

  useEffect(() => {
    analyzeJobMatch();
  }, [jobDescription]);

  const analyzeJobMatch = async () => {
    if (!userProfile) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await aiService.analyzeJobMatch(jobDescription, userProfile);
      setMatchAnalysis(analysis);
      
      // Generate cover letter and resume customization in parallel
      const [coverLetterResult, resumeCustomization] = await Promise.all([
        aiService.generateCoverLetter(jobDescription, userProfile),
        aiService.customizeResume(jobDescription, userProfile.resume)
      ]);
      
      setCoverLetter(coverLetterResult);
      setCustomizedResume(resumeCustomization);
    } catch (error) {
      console.error('Error during job analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) return;

    const application = {
      id: `${jobId}-${Date.now()}`,
      jobId,
      status: 'pending' as const,
      coverLetter,
      customizedResume,
      matchScore: matchAnalysis?.matchPercentage || 0,
    };

    dispatch(addApplication(application));
  };

  if (!userProfile) {
    return <div className="text-center p-4">Please log in to apply for jobs</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {isAnalyzing ? (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing job match and preparing your application...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {matchAnalysis && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Match Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Match Score</p>
                  <p className="text-2xl font-bold text-blue-600">{matchAnalysis.matchPercentage}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Key Matching Skills</p>
                  <ul className="list-disc list-inside">
                    {matchAnalysis.keyMatchingSkills?.map((skill: string, index: number) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full h-64 p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customized Resume Preview
            </label>
            <div className="border rounded-lg p-4 bg-gray-50">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(customizedResume, null, 2)}
              </pre>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isAnalyzing}
          >
            Submit Application
          </button>
        </form>
      )}
    </div>
  );
};

export default JobApplicationForm; 