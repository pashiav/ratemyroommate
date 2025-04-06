import { ClerkProvider, RedirectToSignIn } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Rate My Roommate',
  description: 'A simple app to rate and manage roommate responsibilities',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider
      // Redirect to the search page after signing in or signing up
      afterSignInUrl="/search"
      afterSignUpUrl="/search"
    >
      <html lang="en">
        <body className={inter.className}>
          {/* Ensure the user is authenticated before rendering content */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
