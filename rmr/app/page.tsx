"use client";

import { useEffect, useState } from "react";
import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);
  const [todoItems, setTodoItems] = useState([
    { id: "signup", label: "SIGN UP!", checked: false },
    { id: "trash", label: "TAKE OUT TRASH", checked: true },
    { id: "sweep", label: "SWEEP", checked: true },
    { id: "dishes", label: "DISHES", checked: false },
  ]);

  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/search");
    }
  }, [isSignedIn]);

  const handleToggle = (id: string) => {
    setTodoItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleGoClick = (e: React.MouseEvent) => {
    if (!email.endsWith(".edu")) {
      e.preventDefault(); // prevent modal from opening
      setShowError(true); // show error message
    } else {
      setShowError(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#315d8d] p-4 relative">
      {/* Login button in top-right */}
      <div className="absolute top-4 right-4">
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="bg-darkblue text-white px-4 py-2 rounded-full hover:bg-darkblue/90 font-lazyDog">
              Log In
            </button>
          </SignInButton>
        )}
      </div>

      <div className="bg-[#f5f5f5] rounded-[96px] shadow-lg p-8 w-full max-w-4xl min-h-screen relative">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="logo">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-[30rem] h-auto max-w-full"
              />
            </div>
          </div>
        </div>

        {/* Fridge handle */}
        <img
          src="/handle.png"
          alt="Fridge Handle"
          className="absolute left-0 ml-24 top-1/3 w-36 h-auto object-contain"
        />

        {/* Shine effects */}
        <img
          src="/shine-left.png"
          alt="shine"
          className="absolute left-0 top-0 mt-6 ml-6 w-xs h-auto object-contain"
        />
        <img
          src="/shine-right.png"
          alt="shine"
          className="absolute right-0 top-0 mt-6 mr-6 w-xs h-auto object-contain"
        />

        {/* To Do List */}
        <div className="mt-10 mx-auto max-w-lg relative">
          <div
            className="border-2 border-navy-blue rounded-lg p-6 pt-0 pb-60 space-y-4"
            style={{ background: "#fdfeff" }}
          >
            {/* Pink magnets */}
            <div
              className="absolute -left-10 -top-6 w-20 h-20 rounded-full border-2"
              style={{
                background:
                  "radial-gradient(circle at center, #e3a4a4 50%, #cd9292 98%)",
              }}
            />
            <div
              className="absolute -right-10 -top-9 w-20 h-20 rounded-full border-2"
              style={{
                background:
                  "radial-gradient(circle at center, #e3a4a4 50%, #cd9292 98%)",
              }}
            />

            <h2
              className="text-xl font-medium text-center font-lazyDog underline"
              style={{ color: "#76708d" }}
            >
              TO DO LIST
            </h2>

            {/* Signup Row */}
            <div className="flex items-start space-x-4 pt-0">
              <Checkbox
                id="signup"
                checked={todoItems[0].checked}
                onCheckedChange={() => handleToggle("signup")}
                className="text-3xl font-bold text-primary font-lazyDog mt-7"
              />
              <div className="flex-1">
                <label
                  htmlFor="signup"
                  className="text-5xl mt-5 block font-bold text-darkblue font-lazyDog"
                >
                  {todoItems[0].label}
                </label>
                <div className="mt-3 flex flex-col gap-1">
                  <div className="flex">
                    <Input
                      placeholder="Enter your .edu email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 border-darkblue rounded-md py-2 px-4"
                    />
                    <SignUpButton mode="modal">
                      <Button
                        onClick={handleGoClick}
                        className="ml-2 bg-darkblue text-white rounded-md px-4 font-lazyDog"
                        disabled={!email.endsWith(".edu")}
                      >
                        GO
                      </Button>
                    </SignUpButton>
                  </div>
                  {showError && (
                    <p className="text-red-600 font-lazyDog text-sm ml-1">
                      Please enter a valid{" "}
                      <span className="underline">.edu</span> email address!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Remaining Checklist */}
            {todoItems.slice(1).map((item) => (
              <div key={item.id} className="flex items-center space-x-4 mt-2">
                <Checkbox
                  id={item.id}
                  disabled={item.id === "dishes"}
                  checked={item.checked}
                  onCheckedChange={() => handleToggle(item.id)}
                  className="w-6 h-6"
                />
                <label
                  htmlFor={item.id}
                  className="text-2xl font-mediu font-lazyDog"
                  style={{ color: "#76708d" }}
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
