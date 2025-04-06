"use client";

import { useState } from "react";
import { SignUpButton } from "@clerk/nextjs";
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

  const handleToggle = (id: string) => {
    setTodoItems(
      todoItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <main className="min-h-screen bg-[#315d8d] p-4">
      <div className="bg-[#f5f5f5] rounded-[96px] shadow-lg p-8 min-h-screen">
        {/* Title cards with rotation effect */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="logo">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-96 h-auto max-w-full"
              />
            </div>
          </div>
        </div>

        {/* Fridge handle */}
        <img
          src="/handle.png"
          alt="Fridge Handle"
          className="absolute left-0 ml-14 top-1/3 w-28 h-auto object-contain"
        />

        {/* shineeeee left */}
        <img
          src="/shine-left.png"
          alt="shine"
          className="absolute left-0 top-0 mt-5 ml-4 w-xs h-auto object-contain"
        />
        {/* shineeeee right */}
        <img
          src="/shine-right.png"
          alt="shine"
          className="absolute right-0 top-0 mt-4 mr-4 w-xs h-auto object-contain"
        />
        {/* To Do List Section */}
        <div className="mt-10 mx-auto max-w-96 relative">
          {/* Todo List Box with pink circles (magnets) at corners */}
          <div
            className="border-2 border-navy-blue rounded-lg p-6 pt-0 pb-16 space-y-2.5"
            style={{ background: "#fdfeff" }}
          >
            {/* Pink circles at corners */}
            <div
              className="absolute -left-10 -top-6 w-20 h-20 rounded-full border-2"
              style={{
                background:
                  "radial-gradient(circle at center, #e3a4a4 50%, #cd9292 98%)",
              }}
            ></div>

            <div
              className="absolute -right-10 -top-9 w-20 h-20 rounded-full border-2"
              style={{
                background:
                  "radial-gradient(circle at center, #e3a4a4 50%, #cd9292 98%)",
              }}
            ></div>
            {/* TO DO LIST small heading at top */}
            <h2
              className="text-xl font-medium text-center font-lazyDog underline"
              style={{ color: "#76708d" }}
            >
              TO DO LIST
            </h2>
            {/* Signup with email field */}
            <div className="flex items-start space-x-4 pt-0">
              <Checkbox
                id="signup"
                checked={todoItems[0].checked}
                onCheckedChange={() => handleToggle("signup")}
                className="text-3xl font-bold text-primary font-lazyDog mt-7"
              />
              {/* Sign up */}
              <div className="flex-1">
                <label
                  htmlFor="signup"
                  className="text-5xl mt-5 block font-bold text-darkblue font-lazyDog"
                >
                  {todoItems[0].label}
                </label>
                {/* Email input */}
                <div className="mt-3 flex">
                  <Input
                    placeholder="Enter your .edu email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-darkblue rounded-md py-2 px-4 -mt-2"
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

            {/* Other todo items */}
            {todoItems.slice(1).map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
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
