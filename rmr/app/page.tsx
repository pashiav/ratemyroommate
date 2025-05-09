"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import LandingTopFridge from "@/components/LandingTopFridge";
import BottomFridge from "@/components/BottomFridge";

export default function Home() {
  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [todoItems, setTodoItems] = useState([
    { id: "waitlist", label: "COMING SOON!", checked: false, submitted: false },
  ]);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState<"success" | "error" | "">(
    ""
  );

  const handleGoClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith(".edu")) {
      setShowError(true);
      setResponseMessage(""); // Clear any previous message
      setResponseType("");
      return;
    }

    setShowError(false);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setResponseMessage("You're already on the list!");
        setResponseType("error");
      } else if (!res.ok) {
        setResponseMessage("Something went wrong. Please try again.");
        setResponseType("error");
      } else {
        setSubmitted(true);
        setEmail("");
        setResponseMessage("You're on the list!");
        setResponseType("success");
        setTodoItems((prev) =>
          prev.map((item) =>
            item.id === "waitlist"
              ? { ...item, checked: true, submitted: true }
              : item
          )
        );
      }
    } catch (err) {
      setResponseMessage("Something went wrong. Please try again.");
      setResponseType("error");
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
    <main className="min-h-screen bg-[#315d8d] pl-4 pr-4">
      <div className="relative z-20 flex justify-center w-full">
        <div className="w-full max-w-[500px] mt-[24em] absolute border-2 border-darkblue rounded-lg p-6 pt-0 pb-[25vh] space-y-4 bg-paper shadow-lg">
          {/* Magnets with more natural highlights */}
          {/* Left pink circle */}
          <div className="absolute -left-12 -top-7 w-24 h-24 rounded-full bg-rosepink">
            <div className="absolute top-3 left-7 w-4 h-1.5 bg-[#f9e1e1] rounded-full transform -rotate-[20deg]"></div>
            <div className="absolute top-6 left-4 w-1.5 h-1 bg-[#f9e1e1] rounded-full transform -rotate-45"></div>
            <div className="absolute bottom-3 right-7 w-3 h-1.5 bg-[#f9e1e1] rounded-full transform -rotate-[20deg]"></div>
          </div>

          {/* Right pink circle */}
          <div className="absolute -right-12 -top-10 w-24 h-24 rounded-full bg-rosepink">
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

          {/* Waitlist task */}
          <div className="flex items-start space-x-4 pt-0">
            <Checkbox
              id="waitlist"
              checked={todoItems[0].checked}
              onCheckedChange={() => handleToggle("waitlist")}
              className="text-3xl font-bold text-primary mt-7"
            />
            <div className="flex-1">
              <label
                htmlFor="waitlist"
                className={`text-5xl mt-5 block font-bold text-darkblue transition-opacity duration-300 ${
                  todoItems[0].submitted ? "opacity-40 line-through" : ""
                }`}
              >
                {todoItems[0].label}
              </label>

              <div className="flex flex-col mt-4">
                {/* Text line*/}
                <p className="text-xl text-darkblue">
                  Be the first to know when we launch.
                </p>

                <p className="text-[0.5rem] text-darkblue mt-0 italic font-sans bold text-left">
                  By submitting your email, you agree to be notified about our
                  launch. Your information will not be shared or sold.
                </p>

                <form
                  onSubmit={handleGoClick}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3"
                >
                  <Input
                    placeholder="you@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={submitted}
                    className="border-2 border-darkblue rounded-xl py-2 px-4"
                  />
                  <Button
                    type="submit"
                    className="bg-darkblue text-white rounded-xl px-4"
                    disabled={submitted}
                  >
                    Notify Me
                  </Button>
                </form>
              </div>

              {showError && (
                <p className="text-red-600 text-sm mt-2">
                  Please enter a valid <span className="underline">.edu</span>{" "}
                  email address!
                </p>
              )}

              {responseMessage && (
                <p
                  className={`text-md mt-2 ${
                    responseType === "error" ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {responseMessage}
                </p>
              )}
            </div>
          </div>

          {/* Other tasks */}
          {todoItems.slice(1).map((item) => (
            <div key={item.id} className="flex items-center space-x-4 mt-2">
              <Checkbox
                id={item.id}
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
        <div className="logo flex justify-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[30rem] h-auto max-w-full"
          />
        </div>
      </LandingTopFridge>

      <BottomFridge>
        <div className="mt-[7rem] bg-paper rounded-[10px] shadow-md p-10 max-w-xl mx-auto text-left text-[#315d8d] border-2 border-darkblue h-[25rem]">
          <h2 className="text-6xl font-bold mb-4 text-center text-darkblue">
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
          </p>
        </div>
      </BottomFridge>
    </main>
  );
}
