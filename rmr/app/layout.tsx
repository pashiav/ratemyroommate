import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import "./globals.css";
import { PostHogProvider } from "../components/PostHogProvider";

export const metadata: Metadata = {
  title: "Rate My Roommate",
  description: "A simple app to rate and manage roommate responsibilities",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: neobrutalism,
        variables: {
          colorPrimary: "#1e3a8a",
          borderRadius: "8px",
          fontFamily: "'Lazy Dog', sans-serif",
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
      afterSignInUrl="/search"
      afterSignUpUrl="/search"
    >
      <html lang="en">
        <body style={{ fontFamily: "'Lazy Dog', sans-serif" }}>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
