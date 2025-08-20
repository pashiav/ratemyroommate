"use client";

import { useEffect, useState } from "react";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import LandingTopFridge from "@/components/LandingTopFridge";
import BottomFridge from "@/components/BottomFridge";
import AuthHeader from "@/components/AuthHeader";

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

  const handleGoClick = (e: React.FormEvent) => {
    e.preventDefault(); // always prevent full form submit
    if (!email.endsWith(".edu")) {
      setShowError(true);
    } else {
      setShowError(false);
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
    <main className="min-h-screen bg-[#315d8d] pl-[0.75rem] pr-[0.75rem]">
      {" "}
      {/* To Do List Section */}
      <div className="relative z-[2] flex justify-center w-full">
        <div className="w-full max-w-[500px] mt-[24em] absolute border-2 border-navy-blue rounded-lg p-6 pt-0 pb-[25vh] space-y-4 bg-[#fdfeff] shadow-lg">
          {/* Magnets with more natural highlights */}
          {/* Left pink circle */}
          <div className="absolute -left-12 -top-7 w-24 h-24 rounded-full bg-rosePink">
            <div className="absolute top-3 left-7 w-4 h-1.5 bg-[#f9e1e1] rounded-full transform -rotate-[20deg]"></div>
            <div className="absolute top-6 left-4 w-1.5 h-1 bg-[#f9e1e1] rounded-full transform -rotate-45"></div>
            <div className="absolute bottom-3 right-7 w-3 h-1.5 bg-[#f9e1e1] rounded-full transform -rotate-[20deg]"></div>
          </div>

          {/* Right pink circle */}
          <div className="absolute -right-12 -top-10 w-24 h-24 rounded-full bg-rosePink">
            <div className="absolute top-3 left-7 w-4 h-1.5 bg-[#f9e1e1] rounded-full transform -rotate-[20deg]"></div>
            <div className="absolute top-6 left-4 w-1.5 h-1 bg-[#f9e1e1] rounded-full transform -rotate-45"></div>
            <div className="absolute top-3 left-7 w-4 h-1.5 bg-[#f9e1e1] rounded-full transform -rotate-[20deg]"></div>
            <div className="absolute bottom-3 right-7 w-3 h-1.5 bg-[#f9e1e1] rounded-full transform -rotate-[20deg]"></div>
          </div>

          {/* TO DO Heading */}
          <h2
            className="text-xl font-medium text-center underline"
            style={{ color: "#a0a6bf" }}
          >
            TO DO LIST
          </h2>

          {/* Sign up task */}
          <div className="flex items-start space-x-4 pt-0">
            <Checkbox
              id="signup"
              checked={todoItems[0].checked}
              onCheckedChange={() => handleToggle("signup")}
              className="text-3xl font-bold text-primary mt-7"
            />
            <div className="flex-1">
              {isSignedIn ? (
                <button
                  onClick={() => (window.location.href = "/search")}
                  className="mt-5 w-full rounded-xl bg-[#e4f1ff] px-6 py-4 text-3xl font-lazyDog font-bold text-darkBlue shadow-md border-2 border-darkBlue border-r-8 border-b-8 hover:bg-[#f4f9ff] transition-all duration-200"
                >
                  SEARCH FOR ROOMMATES
                </button>
              ) : (
                <>
                  <label
                    htmlFor="signup"
                    className="text-5xl mt-5 block font-bold text-darkBlue"
                  >
                    {todoItems[0].label}
                  </label>

                  <form className="flex" onSubmit={handleGoClick}>
                    <Input
                      placeholder="Enter your .edu email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 border-darkBlue rounded-md py-2 px-4"
                    />
                    <SignUpButton
                      mode="modal"
                      initialValues={{
                        emailAddress: email,
                      }}
                    >
                      <Button
                        onClick={handleGoClick}
                        className="ml-2 bg-darkBlue text-white rounded-md px-4"
                        disabled={!email.endsWith(".edu")}
                      >
                        GO
                      </Button>
                    </SignUpButton>
                  </form>

                  {showError && (
                    <p className="text-red-600 text-sm ml-1">
                      Please enter a valid{" "}
                      <span className="underline">.edu</span> email address!
                    </p>
                  )}
                </>
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
                className="text-2xl font-medium"
                style={{ color: "#a0a6bf" }}
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      <LandingTopFridge>
        <AuthHeader />
        <div className="logo flex justify-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[30rem] h-auto max-w-full z-0 pointer-events-none"
          />
        </div>
      </LandingTopFridge>
      <BottomFridge>
        <div className="mt-[30vh] bg-[#fdfeff] rounded-[10px] shadow-md p-8 max-w-xl mx-auto text-left text-[#315d8d]">
          <h2 className="text-6xl font-bold mb-4 text-center text-darkBlue">
            About RMR
          </h2>
          <p className="text-md font-sans italic">
            We’ve all had unpredictable roommates - and wished we knew more
            before moving in.
            <br />
            <br />
            Rate My Roommate helps students share honest, verified reviews to
            make finding the right roommate easier and safer.
            <br />
            <br />
            All reviews are tied to .edu emails, so only real students can
            contribute.
            <br />
            <br />
          </p>
        </div>
      </BottomFridge>
    </main>
  );
}
