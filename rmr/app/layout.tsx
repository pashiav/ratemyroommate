// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import "./globals.css";

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
    appearance={{
      baseTheme: neobrutalism,
      variables: {
        colorPrimary: "#1e3a8a",
        borderRadius: "8px",
      fontFamily: "'Lazy Dog', cursive", 
      },
    }}
      localization={{
        signUp: {
          start: {
            title: "Create an account",
            subtitle: "Use your .edu email address only",
          },
        },
        signIn: {
          start: {
            title: "Welcome back!",
            subtitle: "Log in with your .edu school email",
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
