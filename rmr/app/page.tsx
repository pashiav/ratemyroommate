"use client";

import { useEffect, useState } from "react";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import TopFridge from "@/components/TopFridge";
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
      {/* To Do List Section */}
      <div className="relative z-20 flex justify-center w-full">
        <div className="w-full max-w-[500px] mt-[24em] absolute border-2 border-navy-blue rounded-lg p-6 pt-0 pb-[25vh] space-y-4 bg-[#fdfeff] shadow-lg">
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
              <label
                htmlFor="signup"
                className="text-5xl mt-5 block font-bold text-darkblue"
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
                <SignUpButton
                  mode="modal"
                  initialValues={{
                    emailAddress: email,
                  }}
                >
                  <Button
                    onClick={handleGoClick}
                    className="ml-2 bg-darkblue text-white rounded-md px-4"
                    disabled={!email.endsWith(".edu")}
                  >
                    GO
                  </Button>
                </SignUpButton>
                {showError && (
                  <p className="text-red-600 text-sm ml-1">
                    Please enter a valid <span className="underline">.edu</span>{" "}
                    email address!
                  </p>
                )}
              </div>
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

      <TopFridge>
        <AuthHeader />
        <div className="logo flex justify-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[30rem] h-auto max-w-full"
          />
        </div>
      </TopFridge>

      <BottomFridge>
        <div className="mt-[30vh] bg-[#fdfeff] rounded-[10px] shadow-md p-8 max-w-xl mx-auto text-left text-[#315d8d] italic">
          <h2 className="text-6xl font-bold mb-4 text-center text-darkblue">About RMR</h2>
          <p className="text-md font-sans">
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
