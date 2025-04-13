// components/AuthHeader.tsx
"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

export default function AuthHeader() {
  const { isSignedIn } = useUser();

  return (
    <div className="absolute top-0 right-0 mt-[4rem] mr-[6rem] z-50">
      {isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton mode="modal">
          <Button
            className="
            bg-darkblue
            text-white 
            px-6 
            py-2 
            text-lg 
            font-lazyDog 
            rounded-md 
            z-50 
          "
          >
            {" "}
            Log In
          </Button>
        </SignInButton>
      )}
    </div>
  );
}
