"use client";

import { useEffect, useState } from "react";
import { SignInButton, SignUpButton, useUser, UserButton } from "@clerk/nextjs";
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

  const handleGoClick = (e: React.MouseEvent) => {
    if (!email.endsWith(".edu")) {
      e.preventDefault(); // prevent modal from opening
      setShowError(true); // show error message
    } else {
      setShowError(false); // clear error if valid
    }
  };

  const handleToggle = (id: string) => {
    setTodoItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <main className="min-h-screen bg-[#315d8d] p-4">
      <div className="bg-[#f5f5f5] rounded-[96px] shadow-lg p-8 min-h-screen relative">
        {/* Title cards */}
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

        {/* Login Button */}
        <div className="absolute top-20 right-28">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button className="bg-darkblue text-white px-6 text-lg py-2 font-lazyDog rounded-md z-50">
                Log In
              </Button>
            </SignInButton>
          )}
        </div>

        {/* To Do List Section */}
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

            {/* TO DO Heading */}
            <h2
              className="text-xl font-medium text-center font-lazyDog underline"
              style={{ color: "#76708d" }}
            >
              TO DO LIST
            </h2>

            {/* Sign up task */}
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
                    Please enter a valid <span className="underline">.edu</span>{" "}
                    email address!
                  </p>
                )}
              </div>
            </div>

            {/* Other tasks */}
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
          <div className="bg-[#f5f5f5] rounded-[96px] -mt-1 shadow-lg p-10 min-h-[55rem] w-[100%] mx-auto relative">
        {/* Fridge handle */}
        <img
          src="/handle.png"
          alt="Fridge Handle"
          className="absolute left-0 ml-24 top-0 mt-28 w-36 h-auto object-contain"
        />
        {/* shineeeee left */}
        <img
          src="/shine-left.png"
          alt="shine"
          className="absolute left-0 top-0 mt-3 ml-4 w-xs h-auto object-contain"
        />
        {/* shineeeee right */}
        <img
          src="/shine-right.png"
          alt="shine"
          className="absolute right-0 top-0 mt-3 mr-4 w-xs h-auto object-contain"
        />

        <div className="mt-32 bg-[#fdfeff] rounded-[10px] shadow-md p-8 max-w-xl mx-auto text-left font-sans text-[#315d8d] italic">
          <h2 className="text-6xl font-bold mb-4 font-lazyDog text-center">About RMR</h2>
          <p className="text-md">
            We’ve all had unpredictable roommates - and wished we knew more
            before moving in.<br />
            <br />
            Rate My Roommate helps students share honest, verified reviews to make
            finding the right roommate easier and safer.
            <br />
            <br />
            All reviews are tied to .edu emails, so only real students can
            contribute.
            <br />
            <br />
          </p>
        </div>
      </div>

      <div className="w-full flex justify-between px-32 -mt-0">
        <div className="w-60 h-20 bg-[#2c2c30] rounded-bl-[40px] rounded-br-[40px]"></div>
        <div className="w-60 h-20 bg-[#2c2c30] rounded-bl-[40px] rounded-br-[40px]"></div>
      
      </div>
    </main>

  );
}
