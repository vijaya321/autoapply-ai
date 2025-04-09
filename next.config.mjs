/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    NEXT_PUBLIC_LINKEDIN_CLIENT_ID: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
    NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET,
    NEXT_PUBLIC_LINKEDIN_REDIRECT_URI: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI,
  },
};

export default nextConfig; 