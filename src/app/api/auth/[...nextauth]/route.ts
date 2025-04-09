import NextAuth from 'next-auth';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { Profile } from 'next-auth';

if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
  throw new Error('Missing LinkedIn OAuth credentials');
}

interface LinkedInProfile extends Profile {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

const handler = NextAuth({
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      wellKnown: 'https://www.linkedin.com/oauth/.well-known/openid-configuration',
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
      issuer: 'https://www.linkedin.com',
      jwks_endpoint: 'https://www.linkedin.com/oauth/jwks',
      userinfo: {
        url: 'https://api.linkedin.com/v2/userinfo',
      },
      profile(profile: LinkedInProfile) {
        console.log('LinkedIn profile data:', profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback:', { 
        user,
        accountId: account?.id,
        accountType: account?.type,
        hasAccessToken: !!account?.access_token,
        profile 
      });
      return true;
    },
    async jwt({ token, account, profile, user }) {
      console.log('JWT callback:', { 
        hasExistingToken: !!token.accessToken,
        hasNewAccount: !!account,
        userId: user?.id
      });
      
      // Initial sign in
      if (account && profile) {
        console.log('Setting initial token data');
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000, // 1 hour
          refreshToken: account.refresh_token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        };
      }

      // Return previous token if the access token has not expired yet
      const tokenExpires = token.accessTokenExpires as number || 0;
      if (Date.now() < tokenExpires) {
        console.log('Existing token is still valid');
        return token;
      }

      console.log('Token needs refresh - but LinkedIn does not support refresh tokens');
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log('Session callback:', { 
        hasToken: !!token.accessToken,
        sessionUser: session?.user,
      });

      if (token) {
        session.accessToken = token.accessToken;
        if (token.user) {
          session.user = {
            ...session.user,
            ...token.user,
          };
        }
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl });
      // Handle relative URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Handle absolute URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  events: {
    async signIn(message) {
      console.log('SignIn event:', message);
    },
    async session(message) {
      console.log('Session event:', message);
    },
    async signOut(message) {
      console.log('SignOut event:', message);
    },
  },
  logger: {
    error(code, metadata) {
      console.error('NextAuth error:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth warning:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth debug:', code, metadata);
    },
  },
});

export { handler as GET, handler as POST }; 