import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';

export class AIService {
  private llm: OpenAI;
  private jobDescriptionChain: LLMChain;

  constructor(apiKey: string) {
    this.llm = new OpenAI({
      openAIApiKey: apiKey,
      temperature: 0.7,
      modelName: 'gpt-4',
    });

    const jobMatchPrompt = PromptTemplate.fromTemplate(
      `Given the job description: {jobDescription}
      And the candidate's profile: {candidateProfile}
      
      Analyze the match and provide:
      1. Match percentage
      2. Key matching skills
      3. Missing skills
      4. Suggested customizations for the application
      
      Format the response as a JSON object.`
    );

    this.jobDescriptionChain = new LLMChain({
      llm: this.llm,
      prompt: jobMatchPrompt,
    });
  }

  async analyzeJobMatch(jobDescription: string, candidateProfile: any) {
    try {
      const result = await this.jobDescriptionChain.call({
        jobDescription,
        candidateProfile: JSON.stringify(candidateProfile),
      });
      return JSON.parse(result.text);
    } catch (error) {
      console.error('Error analyzing job match:', error);
      throw error;
    }
  }

  async generateCoverLetter(jobDescription: string, candidateProfile: any) {
    const prompt = `Generate a professional cover letter for the following job:
      ${jobDescription}
      
      Using this candidate profile:
      ${JSON.stringify(candidateProfile)}
      
      Make it personalized, professional, and highlight relevant experience.`;

    try {
      const response = await this.llm.call(prompt);
      return response;
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw error;
    }
  }

  async customizeResume(jobDescription: string, baseResume: any) {
    const prompt = `Customize this resume for the following job description:
      ${jobDescription}
      
      Base resume:
      ${JSON.stringify(baseResume)}
      
      Provide suggestions for:
      1. Skills to emphasize
      2. Experience to highlight
      3. Keywords to add
      Format as JSON.`;

    try {
      const response = await this.llm.call(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error customizing resume:', error);
      throw error;
    }
  }
} 