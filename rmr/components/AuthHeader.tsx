"use client";

import { useEffect, useState, useRef } from "react";
import { SignInButton, useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCog } from "@fortawesome/free-solid-svg-icons";

export default function AuthHeader() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);

  // Add these state variables to your component
  const [newSchoolEmail, setNewSchoolEmail] = useState("");
  const [schoolChangeMessage, setSchoolChangeMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add this function to handle school change
  const handleSchoolChange = async () => {
    if (
      !newSchoolEmail ||
      !newSchoolEmail.includes("@") ||
      !newSchoolEmail.endsWith(".edu")
    ) {
      setSchoolChangeMessage("Please enter a valid .edu email address");
      return;
    }

    setIsSubmitting(true);
    setSchoolChangeMessage("");

    try {
      // Get school by domain
      const emailDomain = newSchoolEmail.split("@")[1];
      const schoolResponse = await fetch("/api/schools/getByDomain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: emailDomain }),
      });

      const schoolData = await schoolResponse.json();

      if (!schoolData?.school_id) {
        setSchoolChangeMessage("We don't recognize this school email domain");
        setIsSubmitting(false);
        return;
      }

      // Change school
      const response = await fetch("/api/user/changeSchool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          new_school_id: schoolData.school_id,
          new_email: newSchoolEmail,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSchoolChangeMessage(
          "School changed successfully! Please check your new email to verify it."
        );
        setNewSchoolEmail("");

        // Refresh after success
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setSchoolChangeMessage(result.error || "Failed to change school");
      }
    } catch (err) {
      console.error("School change error:", err);
      setSchoolChangeMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showAccountModal && user) {
      console.log("🔍 Clerk user object:", user);

      console.log(
        "✅ showAccountModal true, user loaded, fetching sessions..."
      );
      user
        .getSessions()
        .then((sessions) => {
          console.log("📦 Clerk session data:", sessions);
          setSessions(sessions);
        })
        .catch((err) => {
          console.error("❌ Error fetching sessions:", err);
        });
    }
  }, [showAccountModal, user]);

  return (
    <div className="absolute top-0 right-0 mt-[3.5rem] mr-[6rem] z-50">
      {isSignedIn ? (
        <>
          <Button
            variant="ghost"
            className="w-10 rounded-full pt-1 pb-1 bg-[#153f65] hover:bg-[#5a6c7c] overflow-hidden"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <FontAwesomeIcon
              icon={faUserCog}
              className="w-5 h-5 ml-1 text-white"
            />
          </Button>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border-[0.1rem] border-black border-r-4 border-b-4 z-50"
            >
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setShowDropdown(false);
                  setShowAccountModal(true);
                }}
              >
                Manage Account
              </button>
              <hr className="mx-2 my-1 border-gray-200" />
              <button
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                onClick={async () => {
                  try {
                    console.log("Sign out clicked");
                    setShowDropdown(false);
                    await signOut();
                    console.log("Sign out successful");
                  } catch (error) {
                    console.error("Error signing out:", error);
                    // Display an error message to the user
                    alert("Failed to sign out. Please try again.");
                  }
                }}
              >
                Sign Out
              </button>
            </div>
          )}

          {showAccountModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="relative w-[50rem] h-[40rem] bg-white p-6 rounded-xl shadow-lg flex flex-col border-2 border-black border-r-8 border-b-8">
                <button
                  className="absolute top-3 right-6 text-gray-500 hover:text-gray-700 text-3xl font-sans"
                  onClick={() => setShowAccountModal(false)}
                >
                  &times;
                </button>

                <h2 className="text-2xl font-bold mb-6">Account<span className="text-xs text-gray-500 ml-3"> Manage your account info.</span></h2>

                <div className="space-y-4">
                  <div>
                    <label className="block font-bold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.primaryEmailAddress?.emailAddress || ""}
                      readOnly
                      className="w-full bg-gray-100 border-2 border-black border-r-4 border-b-4 rounded-md px-3 py-2 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border-2 border-black border-r-4 border-b-4 rounded-md px-3 py-2"
                    />
                    <Button
                      className="mt-2 border-2 border-black font-bold"
                      onClick={async () => {
                        setPasswordSuccess("");
                        setPasswordError("");
                        try {
                          await user?.updatePassword({ newPassword });
                          setPasswordSuccess("Password updated!");
                          setNewPassword("");
                        } catch (err: any) {
                          setPasswordError(
                            err.errors?.[0]?.message || "Something went wrong"
                          );
                        }
                      }}
                    >
                      Change Password
                    </Button>
                    {passwordSuccess && (
                      <p className="text-green-600 font-semibold mt-2">
                        {passwordSuccess}
                      </p>
                    )}
                    {passwordError && (
                      <p className="text-red-600 font-semibold mt-2">
                        {passwordError}
                      </p>
                    )}
                  </div>
                  <div className="mt-8 border-t-2 pt-4">
                    <h3 className="text-xl font-bold mb-2">Change School</h3>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                      <p className="text-yellow-700">
                        <strong>Warning:</strong> Changing your school will
                        remove access to all reviews from your current school.
                        You will only see content from your new school.
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="block font-bold mb-1">
                        New School Email
                      </label>
                      <input
                        type="email"
                        value={newSchoolEmail}
                        onChange={(e) => setNewSchoolEmail(e.target.value)}
                        className="w-full border-2 border-black border-r-4 border-b-4 rounded-md px-3 py-2"
                        placeholder="your@newschool.edu"
                        disabled={isSubmitting}
                      />
                    </div>

                    <Button
                      className="mt-2 border-2 border-black font-bold"
                      onClick={handleSchoolChange}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Change School"}
                    </Button>

                    {schoolChangeMessage && (
                      <p
                        className={`font-semibold mt-2 ${
                          schoolChangeMessage.includes("success")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {schoolChangeMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <SignInButton mode="modal">
          <Button className="bg-darkblue text-white px-6 py-2 text-lg font-lazyDog rounded-md">
            Log In
          </Button>
        </SignInButton>
      )}
    </div>
  );
}
