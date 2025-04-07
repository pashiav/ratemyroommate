// components/AuthHeader.tsx
"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

export default function AuthHeader() {
  const { isSignedIn } = useUser();

  return (
    <div className="absolute top-20 right-28 z-50">
      {isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton 
        mode="modal"
        >
          <Button className="bg-darkblue text-white px-6 text-lg py-2 font-lazyDog rounded-md z-50">
            Log In
          </Button>
        </SignInButton>
      )}
    </div>
  );
}
