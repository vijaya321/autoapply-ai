import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    profile?: any;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    profile?: any;
  }
} 