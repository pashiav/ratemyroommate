"use client";

import { useEffect, useState } from "react";
import { useUser, SignUpButton, SignInButton } from "@clerk/nextjs";
import TopFridge from "@/components/TopFridge";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component that forces unauthenticated users to sign up
 * Uses Clerk's built-in modal and prevents page interaction until signed in
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted and loaded
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#315d8d] flex items-center justify-center">
        <div className="text-white text-xl font-lazyDog animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  // If signed in, just render children
  if (isSignedIn) {
    return <>{children}</>;
  }

  // If not signed in, show blocking overlay with sign-up prompt
  return (
    <TopFridge showSearchBar={false}>
      <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center z-[999999] p-4">
        <div className="relative bg-[#fafafa] w-full max-w-[90%] sm:max-w-[500px] md:max-w-[600px] bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl border-4 border-darkBlue border-r-8 border-b-8">

          {/* Content */}
          <div className="text-center mt-2">
            {/* Icon */}
            <div className="mb-4 sm:mb-6">
              <div className="inline-flex items-center justify-center w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-lightBlue rounded-full">
                <svg
                  className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-darkBlue mb-3 sm:mb-4 font-lazyDog">
              Sign Up Required
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed px-2">
              To access roommate reviews and help others avoid nightmare
              roommates, you'll need to sign up with your{" "}
              <span className="font-bold text-darkBlue">.edu email</span>.
            </p>

            {/* Features list */}
            <div className="bg-blue-50 rounded-xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 text-left">
              <p className="font-bold text-darkBlue mb-3 text-sm sm:text-base">
                With an account, you can:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm md:text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  <span>Search and view roommate reviews</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  <span>Leave reviews to help other students</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  <span>Find housing with verified reviews</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  <span>Access reviews from students at your school</span>
                </li>
              </ul>
            </div>

            {/* Sign up button - Uses Clerk's modal */}
            <SignUpButton mode="modal">
              <button className="w-full bg-darkBlue text-white text-base sm:text-lg md:text-xl font-lazyDog font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-darkBlue border-r-4 border-b-4 hover:scale-[1.02]">
                Sign up with your .edu email
              </button>
            </SignUpButton>

            {/* Additional info */}
            <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
              Already have an account?{" "}
              <SignInButton mode="modal">
                <button className="text-lightBlue font-semibold hover:underline">
                  Log in here
                </button>
              </SignInButton>
            </p>
          </div>
        </div>
      </div>
    </TopFridge>
  );
}
