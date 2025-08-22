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
import Footer from "@/components/Footer";

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
    <main className="min-h-screen bg-[#315d8d] px-2 sm:px-4 md:px-6 lg:px-8">
      {/* To Do List Section - Hangs over bottom fridge */}
      <div className="relative z-[2] flex justify-center w-full">
        <div className="w-full max-w-[80%] sm:max-w-[60%] md:max-w-[60%] lg:max-w-[500px] mt-[13rem] sm:mt-[16rem] md:mt-[17rem] lg:mt-[22rem] xl:mt-[24rem] absolute border-2 border-navy-blue rounded-lg p-3 sm:p-4 md:p-6 pt-0 pb-[10vh] sm:pb-[15vh] md:pb-[20vh] lg:pb-[25vh] space-y-2 sm:space-y-3 md:space-y-4 bg-[#fdfeff] shadow-lg">
          {/* Magnets with more natural highlights - Responsive positioning */}
          {/* Left pink circle */}
          <div className="absolute -left-6 sm:-left-8 md:-left-10 lg:-left-12 -top-4 sm:-top-5 md:-top-6 lg:-top-7 w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24 rounded-full bg-rosePink">
            <div className="absolute top-1.5 sm:top-2 md:top-3 left-3 sm:left-5 md:left-7 w-2 sm:w-3 md:w-4 h-0.5 sm:h-1 md:h-1.5 bg-[#f9e1e1] rounded-full transform -rotate-[20deg]"></div>
            <div className="absolute top-3 sm:top-4 md:top-6 left-2 sm:left-3 md:left-4 w-0.5 sm:w-1 md:w-1.5 h-0.25 sm:h-0.5 md:h-1 bg-[#f9e1e1] rounded-full transform -rotate-45"></div>
            <div className="absolute bottom-1.5 sm:bottom-2 md:bottom-3 right-3 sm:right-5 md:right-7 w-2 sm:w-2.5 md:w-3 h-0.5 sm:h-1 md:h-1.5 bg-[#f9e1e1] rounded-full transform -rotate-[20deg]"></div>
          </div>

          {/* Right pink circle */}
          <div className="absolute -right-6 sm:-right-8 md:-right-10 lg:-right-12 -top-6 sm:-top-8 md:-top-10 lg:-top-10 w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24 rounded-full bg-rosePink">
            <div className="absolute top-1.5 sm:top-2 md:top-3 left-3 sm:left-5 md:left-7 w-2 sm:w-3 md:w-4 h-0.5 sm:h-1 md:h-1.5 bg-[#f9e1e1] rounded-full transform -rotate-[20deg]"></div>
            <div className="absolute top-3 sm:top-4 md:top-6 left-2 sm:left-3 md:left-4 w-0.5 sm:w-1 md:w-1.5 h-0.25 sm:h-0.5 md:h-1 bg-[#f9e1e1] rounded-full transform -rotate-45"></div>
            <div className="absolute top-1.5 sm:top-2 md:top-3 left-3 sm:left-5 md:left-7 w-2 sm:w-3 md:w-4 h-0.5 sm:h-1 md:h-1.5 bg-[#f9e1e1] rounded-full transform -rotate-[20deg]"></div>
            <div className="absolute bottom-1.5 sm:bottom-2 md:bottom-3 right-3 sm:right-5 md:right-7 w-2 sm:w-2.5 md:w-3 h-0.5 sm:h-1 md:h-1.5 bg-[#f9e1e1] rounded-full transform -rotate-[20deg]"></div>
          </div>

          {/* TO DO Heading */}
          <h2
            className="text-base sm:text-lg md:text-xl font-medium text-center underline"
            style={{ color: "#a0a6bf" }}
          >
            TO DO LIST
          </h2>

          {/* Sign up task */}
          <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4 pt-0">
            <Checkbox
              id="signup"
              checked={todoItems[0].checked}
              onCheckedChange={() => handleToggle("signup")}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mt-3 sm:mt-5 md:mt-7 flex-shrink-0"
            />
            <div className="flex-1 w-full">
              {isSignedIn ? (
                <button
                  onClick={() => (window.location.href = "/search")}
                  className="mt-2 sm:mt-3 md:mt-5 w-full rounded-xl bg-[#e4f1ff] px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-lazyDog font-bold text-darkBlue shadow-md border-2 border-darkBlue border-r-2 sm:border-r-4 md:border-r-6 lg:border-r-8 border-b-2 sm:border-b-4 md:border-b-6 lg:border-b-8 hover:bg-[#f4f9ff] transition-all duration-200"
                >
                  SEARCH FOR ROOMMATES
                </button>
              ) : (
                <>
                  <label
                    htmlFor="signup"
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2 sm:mt-3 md:mt-5 block font-bold text-darkBlue"
                  >
                    {todoItems[0].label}
                  </label>

                  <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-3" onSubmit={handleGoClick}>
                    <Input
                      placeholder="Enter your .edu email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 border-darkBlue rounded-md py-2 px-3 sm:px-4 text-sm sm:text-base w-full"
                    />
                    <SignUpButton
                      mode="modal"
                      initialValues={{
                        emailAddress: email,
                      }}
                    >
                      <Button
                        onClick={handleGoClick}
                        className="sm:ml-2 bg-darkBlue text-white rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base w-full sm:w-auto"
                        disabled={!email.endsWith(".edu")}
                      >
                        GO
                      </Button>
                    </SignUpButton>
                  </form>

                  {showError && (
                    <p className="text-red-600 text-xs sm:text-sm ml-1 mt-2">
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
            <div key={item.id} className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mt-2">
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={() => handleToggle(item.id)}
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              />
              <label
                htmlFor={item.id}
                className="text-sm sm:text-lg md:text-xl lg:text-2xl font-medium"
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
            className="w-[15rem] sm:w-[20rem] md:w-[20rem] lg:w-[25rem] h-auto max-w-full z-0 pointer-events-none"
          />
        </div>
      </LandingTopFridge>
      
      <BottomFridge>
        <div className="mt-[15vh] sm:mt-[20vh] md:mt-[25vh] lg:mt-[30vh] bg-[#fdfeff] rounded-[10px] shadow-md p-4 sm:p-6 md:p-8 max-w-lg sm:max-w-xl mx-auto text-left text-[#315d8d]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center text-darkBlue">
            About RMR
          </h2>
          <p className="text-sm sm:text-base font-sans italic leading-relaxed">
            We've all had unpredictable roommates - and wished we knew more
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

        {/* Demo Section */}
        <div className="mt-8 sm:mt-12 md:mt-16 bg-[#fdfeff] rounded-[10px] shadow-md p-4 sm:p-6 md:p-8 max-w-lg sm:max-w-xl mx-auto text-left text-[#315d8d]">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center text-darkBlue">
            Try It Out
          </h3>
          <div className="space-y-4">
            <div className="bg-[#e4f1ff] p-4 rounded-lg border-2 border-darkBlue">
              <h4 className="font-bold text-darkBlue mb-2">Search for Roommates</h4>
              <p className="text-sm text-darkBlue mb-3">Find potential roommates in your area with detailed reviews and ratings.</p>
              <a 
                href="/search" 
                className="inline-block bg-darkBlue text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-80 transition-colors"
              >
                Start Searching
              </a>
            </div>
            
            <div className="bg-[#e4f1ff] p-4 rounded-lg border-2 border-darkBlue">
              <h4 className="font-bold text-darkBlue mb-2">Add a Roommate</h4>
              <p className="text-sm text-darkBlue mb-3">Share your experience with a roommate to help other students.</p>
              <a 
                href="/roommate/new" 
                className="inline-block bg-darkBlue text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-80 transition-colors"
              >
                Add Review
              </a>
            </div>
            
            <div className="bg-[#e4f1ff] p-4 rounded-lg border-2 border-darkBlue">
              <h4 className="font-bold text-darkBlue mb-2">Find Housing</h4>
              <p className="text-sm text-darkBlue mb-3">Discover housing options with roommate reviews and ratings.</p>
              <a 
                href="/housing/new" 
                className="inline-block bg-darkBlue text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-80 transition-colors"
              >
                Browse Housing
              </a>
            </div>
          </div>
        </div>
      </BottomFridge>

      {/* Footer */}
      <Footer />
    </main>
  );
}
