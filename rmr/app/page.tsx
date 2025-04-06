"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [email, setEmail] = useState("");
  const [todoItems, setTodoItems] = useState([
    { id: "signup", label: "SIGN UP!", checked: false },
    { id: "trash", label: "TAKE OUT TRASH", checked: true },
    { id: "sweep", label: "SWEEP", checked: true },
    { id: "dishes", label: "DISHES", checked: false },
  ]);

  const { isSignedIn, user } = useUser(); // Using useUser() to get user data
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/search"); // Redirect after sign-in
    }
  }, [isSignedIn]);

  const handleToggle = (id: string) => {
    setTodoItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-blue-50 p-4 relative">
      {/* Login button in top-right */}
      <div className="absolute top-4 right-4">
        {isSignedIn ? (
          <UserButton /> // Clerk's UserButton to display the profile when signed in
        ) : (
          <SignInButton mode="modal">
            <button className="bg-navy-blue text-white px-4 py-2 rounded-full hover:bg-navy-blue/90">
              Log In
            </button>
          </SignInButton>
        )}
      </div>

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-lg p-8">
        {/* Decorative bar */}
        <div className="absolute left-4 top-1/4 bottom-1/2 w-8 bg-navy-blue rounded-full"></div>

        {/* Title cards */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="absolute -top-6 -left-8 bg-light-blue p-4 rounded-lg rotate-3 shadow-sm">
              <p className="text-3xl font-bold text-navy-blue">RATE</p>
              <div className="flex">
                <div className="w-6 h-6 rounded-full border-2 border-navy-blue flex items-center justify-center">
                  <span className="text-navy-blue">:|</span>
                </div>
                <span className="text-navy-blue ml-2">⋆⋆</span>
              </div>
            </div>
            <div className="absolute -top-2 left-16 bg-light-blue p-4 rounded-lg -rotate-2 shadow-sm">
              <p className="text-3xl font-bold text-navy-blue">MY</p>
            </div>
            <div className="bg-light-blue p-6 rounded-lg shadow z-10">
              <p className="text-5xl font-bold text-navy-blue">ROOMMATE</p>
            </div>
          </div>
        </div>

        {/* TO DO LIST */}
        <div className="mt-8 border-t-2 border-b-2 border-pink-300 py-4 relative">
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-pink-300 rounded-full"></div>
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-pink-300 rounded-full"></div>

          <h2 className="text-center text-xl text-gray-600 font-medium mb-4 underline">TO DO LIST</h2>

          <div className="space-y-4">
            {/* Signup input + button */}
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="signup" 
                checked={todoItems[0].checked} 
                onCheckedChange={() => handleToggle("signup")}
                className="mt-1 data-[state=checked]:bg-navy-blue"
              />
              <div className="flex-1">
                <label htmlFor="signup" className="text-2xl font-bold text-navy-blue">
                  {todoItems[0].label}
                </label>
                <div className="mt-2 flex">
                  <Input 
                    placeholder="Enter your .edu email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-navy-blue rounded-md"
                  />
                  <SignUpButton mode="modal">
                    <Button
                      className="ml-2 bg-navy-blue text-white rounded-md px-4"
                      disabled={!email.endsWith(".edu")}
                    >
                      GO
                    </Button>
                  </SignUpButton>
                </div>
              </div>
            </div>

            {/* Other checklist items */}
            {todoItems.slice(1).map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={item.id} 
                  checked={item.checked} 
                  onCheckedChange={() => handleToggle(item.id)}
                  className="data-[state=checked]:bg-navy-blue"
                />
                <label 
                  htmlFor={item.id} 
                  className="text-xl font-medium text-purple-500"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
