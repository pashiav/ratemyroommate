// middleware.ts (root)
import { clerkMiddleware } from '@clerk/nextjs/server';
import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

const mergedMiddleware = clerkMiddleware(async (auth, request: NextRequest) => {
  return await updateSession(request); // still runs your Supabase setup
});

export default mergedMiddleware;

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/api/webhooks(.*)',
  ],
};
