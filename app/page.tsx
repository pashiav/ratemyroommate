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
import { FaFireExtinguisher } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaHouseCircleCheck } from "react-icons/fa6";
import { FiCheck } from "react-icons/fi";
import { BsFillFileBarGraphFill } from "react-icons/bs";
import { AiFillSound } from "react-icons/ai";
import { LuMessageCircleMore } from "react-icons/lu";
import { FaBed } from "react-icons/fa";
import { GiMagicBroom } from "react-icons/gi";
import { IoMdPeople } from "react-icons/io";
import { TbPigMoney } from "react-icons/tb";
import { PiStudentFill } from "react-icons/pi";
import { GoChevronRight } from "react-icons/go";

export default function Home() {
  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [todoItems, setTodoItems] = useState([
    { id: "signup", label: "Sign up with your .edu email", checked: false },
    { id: "trash", label: "TAKE OUT TRASH", checked: true },
    { id: "sweep", label: "SWEEP", checked: true },
    { id: "dishes", label: "DISHES", checked: false },
  ]);

  const { isSignedIn: clerkIsSignedIn } = useUser();

  useEffect(() => {
    setIsSignedIn(clerkIsSignedIn || false);
    setIsLoaded(true);
  }, [clerkIsSignedIn]);

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
      <AuthHeader />

      {/* To Do List Section - Hangs over bottom fridge */}
      <div className="relative z-[2] flex justify-center w-full">
        <div className="w-full max-w-[80%] sm:max-w-[60%] md:max-w-[60%] lg:max-w-[500px] mt-[17rem] sm:mt-[17rem] md:mt-[17rem] lg:mt-[20rem] xl:mt-[20rem] absolute border-2 border-navy-blue rounded-2xl p-3 sm:p-4 md:p-6 pt-0 pb-[10vh] sm:pb-[15vh] md:pb-[20vh] lg:pb-[25vh] space-y-2 sm:space-y-3 md:space-y-4 bg-[#fdfeff] border-2 border-darkBlue shadow-lg">
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
          <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4 pt-0 -mt-12">
            <Checkbox
              id="signup"
              checked={todoItems[0].checked}
              onCheckedChange={() => handleToggle("signup")}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mt-3 sm:mt-5 md:mt-7 flex-shrink-0"
            />
            <div className="flex-1 w-full">
              {!isLoaded ? (
                <div className="mt-2 sm:mt-3 md:mt-5 w-full rounded-xl bg-gray-100 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-lazyDog font-bold text-darkBlue flex items-center justify-center">
                  Loading
                  <span className="dot ml-1">.</span>
                  <span className="dot ml-1" style={{ animationDelay: "0.2s" }}>
                    .
                  </span>
                  <span className="dot ml-1" style={{ animationDelay: "0.4s" }}>
                    .
                  </span>
                </div>
              ) : isSignedIn ? (
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
                    Sign up! <span className="text-sm">with your .edu email</span>
                  </label>

                  <form
                    className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-3"
                    onSubmit={handleGoClick}
                  >
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
                        <GoChevronRight className="w-4 h-4" />
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
            <div
              key={item.id}
              className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mt-2"
            >
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
        <div className="logo flex justify-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[20rem] sm:w-[20rem] md:w-[20rem] lg:w-[25rem] h-auto max-w-full z-0 pointer-events-none"
          />
        </div>
      </LandingTopFridge>

      <BottomFridge>
        {/* Hero Problem Statement - Immediate Impact */}
        <div className="mt-[15vh] sm:mt-[30vh] md:mt-[18vh] lg:mt-[12vh] xl:mt-[15vh] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl md:max-w-xl lg:max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-bold mb-6 text-darkBlue">
              Tired of Nightmare Roommates?{" "}
              <FaFireExtinguisher className="inline ml-2 text-darkBlue" />
            </h2>
            <p className="text-lg sm:text-lg md:text-xl text-[#315d8d] mb-8 max-w-2xl mx-auto leading-loose">
              <strong className="block mb-4">
                We had terrible roommates and wished we could have known
                beforehand.
              </strong>
              Rate My Roommate is basically{" "}
              <span className="font-bold text-darkBlue">
                Yelp for roommates
              </span>{" "}
              - so you can avoid the people who don't clean, blast music at 3am,
              or invite strangers over constantly.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm sm:text-base text-[#315d8d]">
              <span className="bg-[#fdfeff] px-3 py-1 rounded-full border border-darkBlue">
                Don't clean (ever)
              </span>
              <span className="bg-[#fdfeff] px-3 py-1 rounded-full border border-darkBlue">
                Blast music at 3am
              </span>
              <span className="bg-[#fdfeff] px-3 py-1 rounded-full border border-darkBlue">
                Invite strangers constantly
              </span>
              <span className="bg-[#fdfeff] px-3 py-1 rounded-full border border-darkBlue">
                Eat your food
              </span>
              <span className="bg-[#fdfeff] px-3 py-1 rounded-full border border-darkBlue">
                Never pay rent
              </span>
            </div>
          </div>
        </div>

        {/* Demo Section - Show the Solution */}
        <div className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center text-darkBlue">
              See It In Action <FaVideo className="inline ml-2 text-darkBlue" />
            </h3>

            {/* Demo GIF Placeholder */}
            <div className="bg-[#fdfeff] rounded-2xl border-2 border-darkBlue p-4 md:p-12 mb-8 text-center shadow-lg">
              <img src="/demo.gif" alt="Demo" className="w-full h-auto" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#e4f1ff] p-6 rounded-xl border-2 border-darkBlue text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">
                  <FaSearch className="mx-auto text-darkBlue" />
                </div>
                <h4 className="font-bold text-darkBlue mb-3 text-lg">
                  Search by Name
                </h4>
                <p className="text-sm text-darkBlue mb-4">
                  See if anyone has reviewed them before you sign that lease
                  together.
                </p>
                {isSignedIn ? (
                  <a
                    href="/search"
                    className="inline-block bg-darkBlue text-white px-6 py-3 rounded-lg text-sm hover:bg-opacity-80 transition-colors font-medium"
                  >
                    Start Searching
                  </a>
                ) : (
                  <SignUpButton mode="modal">
                    <button className="inline-block bg-darkBlue text-white px-6 py-3 rounded-lg text-sm hover:bg-opacity-80 transition-colors font-medium">
                      Start Searching
                    </button>
                  </SignUpButton>
                )}
              </div>

              <div className="bg-[#e4f1ff] p-6 rounded-xl border-2 border-darkBlue text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">
                  <FaRegStar className="mx-auto text-darkBlue" />
                </div>
                <h4 className="font-bold text-darkBlue mb-3 text-lg">
                  Leave Reviews
                </h4>
                <p className="text-sm text-darkBlue mb-4">
                  Rate cleanliness, noise, communication, and whether you'd live
                  with them again.
                </p>
                {isSignedIn ? (
                  <a
                    href="/roommate/new"
                    className="inline-block bg-darkBlue text-white px-6 py-3 rounded-lg text-sm hover:bg-opacity-80 transition-colors font-medium"
                  >
                    Share Experience
                  </a>
                ) : (
                  <SignUpButton mode="modal">
                    <button className="inline-block bg-darkBlue text-white px-6 py-3 rounded-lg text-sm hover:bg-opacity-80 transition-colors font-medium">
                      Share Experience
                    </button>
                  </SignUpButton>
                )}
              </div>

              <div className="bg-[#e4f1ff] p-6 rounded-xl border-2 border-darkBlue text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">
                  <FaHouseCircleCheck className="mx-auto text-darkBlue" />
                </div>
                <h4 className="font-bold text-darkBlue mb-3 text-lg">
                  Find Housing
                </h4>
                <p className="text-sm text-darkBlue mb-4">
                  Discover dorms, apartments, and housing with roommate reviews
                  and ratings.
                </p>
                {isSignedIn ? (
                  <a
                    href="/housing/new"
                    className="inline-block bg-darkBlue text-white px-6 py-3 rounded-lg text-sm hover:bg-opacity-80 transition-colors font-medium"
                  >
                    Browse Housing
                  </a>
                ) : (
                  <SignUpButton mode="modal">
                    <button className="inline-block bg-darkBlue text-white px-6 py-3 rounded-lg text-sm hover:bg-opacity-80 transition-colors font-medium">
                      Browse Housing
                    </button>
                  </SignUpButton>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* How It Works - Simple Steps */}
        <div className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-center text-darkBlue">
              How It Works <FiCheck className="inline ml-2 text-darkBlue" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="bg-darkBlue text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-darkBlue mb-2 text-lg">
                    Sign up with your .edu email
                  </h4>
                  <p className="text-darkBlue">
                    Only verified students can post reviews - no fake accounts
                    or trolls.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-darkBlue text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-darkBlue mb-2 text-lg">
                    Search potential roommates
                  </h4>
                  <p className="text-darkBlue">
                    Look up anyone by name to see if they've been reviewed by
                    other students.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-darkBlue text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-darkBlue mb-2 text-lg">
                    Read honest reviews
                  </h4>
                  <p className="text-darkBlue">
                    See detailed ratings on cleanliness, noise, communication,
                    and overall compatibility.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-darkBlue text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-darkBlue mb-2 text-lg">
                    Help others dodge bullets
                  </h4>
                  <p className="text-darkBlue">
                    Share your own experiences to save others from nightmare
                    roommates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Rate - Detailed Breakdown */}
        <div className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-center text-darkBlue">
              What We Rate{" "}
              <BsFillFileBarGraphFill className="inline ml-2 text-darkBlue" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#e4f1ff] p-4 rounded-xl border border-darkBlue text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">
                  <GiMagicBroom className="mx-auto text-darkBlue" />
                </div>
                <h4 className="font-bold text-darkBlue text-sm mb-1">
                  Cleanliness
                </h4>
                <p className="text-xs text-darkBlue">
                  Do they keep shared spaces clean?
                </p>
              </div>
              <div className="bg-[#e4f1ff] p-4 rounded-xl border border-darkBlue text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">
                  <AiFillSound className="mx-auto text-darkBlue" />
                </div>
                <h4 className="font-bold text-darkBlue text-sm mb-1">
                  Noise Level
                </h4>
                <p className="text-xs text-darkBlue">
                  Are they considerate of quiet hours?
                </p>
              </div>
              <div className="bg-[#e4f1ff] p-4 rounded-xl border border-darkBlue text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">
                  <LuMessageCircleMore className="mx-auto text-darkBlue" />
                </div>
                <h4 className="font-bold text-darkBlue text-sm mb-1">
                  Communication
                </h4>
                <p className="text-xs text-darkBlue">
                  Do they communicate issues clearly?
                </p>
              </div>
              <div className="bg-[#e4f1ff] p-4 rounded-xl border border-darkBlue text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">
                  <TbPigMoney className="mx-auto text-darkBlue" />
                </div>
                <h4 className="font-bold text-darkBlue text-sm mb-1">
                  Responsibility
                </h4>
                <p className="text-xs text-darkBlue">
                  Do they pay bills and follow rules?
                </p>
              </div>
              <div className="bg-[#e4f1ff] p-4 rounded-xl border border-darkBlue text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">
                  <IoMdPeople className="mx-auto text-darkBlue" />
                </div>
                <h4 className="font-bold text-darkBlue text-sm mb-1">
                  Guest Frequency
                </h4>
                <p className="text-xs text-darkBlue">
                  How often do they have visitors?
                </p>
              </div>
              <div className="bg-[#e4f1ff] p-4 rounded-xl border border-darkBlue text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">
                  <FaBed className="mx-auto text-darkBlue" />
                </div>
                <h4 className="font-bold text-darkBlue text-sm mb-1">
                  Sleep Schedule
                </h4>
                <p className="text-xs text-darkBlue">
                  Are your sleep patterns compatible?
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <div className="bg-[#fdfeff] rounded-xl border-2 border-red-500 p-6 max-w-2xl mx-auto">
                <p className="text-lg font-bold text-darkBlue">
                  Most importantly:{" "}
                  <span className="text-red-600">
                    Would you live with them again?
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Security */}
        <div className="px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-darkBlue">
              Verified Students Only{" "}
              <PiStudentFill className="inline ml-2 text-darkBlue" />
            </h3>
            <p className="text-lg text-[#315d8d] leading-relaxed">
              All reviews require verified{" "}
              <span className="font-bold text-darkBlue">.edu emails</span>, so
              it's actual students sharing real experiences, not random internet
              trolls. You can only access reviews for roommates at your own
              school.
            </p>
          </div>
        </div>
      </BottomFridge>

      {/* Footer */}
      <Footer />

      {/* CSS animations for the loading dots */}
      <style jsx>{`
        .dot {
          animation: blink 1.4s infinite both;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}
