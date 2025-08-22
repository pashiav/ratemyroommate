"use client";

import { useEffect, useState, useRef } from "react";
import { SignInButton, useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCog } from "@fortawesome/free-solid-svg-icons";

export default function AuthHeader() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();

  // State management for dropdown and modal visibility
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // State for password change functionality
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Handle clicks outside dropdown and modal to close them
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        showAccountModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowAccountModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, showAccountModal]);

  if (!isLoaded) return null;

  return (
    <div className="absolute top-0 right-0 mt-[3rem] sm:mt-[3rem] md:mt-[2.5rem] lg:mt-[3rem] mr-[3rem] sm:mr-[3rem] md:mr-[4rem] lg:mr-[6rem] z-[100]">
      {isSignedIn ? (
        <>
          {/* User Account Button */}
          <Button
            variant="ghost"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full pt-1 pb-1 bg-[#153f65] hover:bg-[#5a6c7c] overflow-hidden"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <FontAwesomeIcon
              icon={faUserCog}
              className="w-4 h-4 sm:w-5 sm:h-5 ml-1 text-white"
            />
          </Button>

          {/* User Dropdown Menu */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-36 sm:w-48 bg-white shadow-lg rounded-md border-[0.1rem] border-black border-r-4 border-b-4 z-[200]"
            >
              <button
                className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 rounded text-sm sm:text-base"
                onClick={() => {
                  setShowDropdown(false);
                  setShowAccountModal(true);
                }}
              >
                Manage Account
              </button>
              <hr className="mx-2 my-1 border-gray-200" />
              <button
                className="w-full text-left px-3 sm:px-4 py-2 text-red-600 hover:bg-gray-100 rounded text-sm sm:text-base"
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

          {/* Account Management Modal */}
          {showAccountModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] p-4">
              <div ref={modalRef} className="relative w-full max-w-[20rem] sm:max-w-[25rem] md:max-w-[30rem] h-auto max-h-[90vh] bg-white p-4 sm:p-6 rounded-xl shadow-lg flex flex-col border-2 border-black border-r-4 sm:border-r-6 md:border-r-8 border-b-4 sm:border-b-6 md:border-b-8">
                {/* Close Button */}
                <button
                  className="absolute top-2 sm:top-3 right-4 sm:right-6 text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl font-sans"
                  onClick={() => setShowAccountModal(false)}
                >
                  &times;
                </button>

                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                  Account
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {/* Email Display (Read-only) */}
                  <div>
                    <label className="block font-bold mb-1 text-sm sm:text-base">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={user?.primaryEmailAddress?.emailAddress || ""}
                      readOnly
                      className="w-full border-2 border-black border-r-2 sm:border-r-4 border-b-2 sm:border-b-4 rounded-md px-3 py-2 text-gray-500 cursor-not-allowed text-sm sm:text-base"
                    />
                  </div>

                  {/* Password Change Section */}
                  <div>
                    <label className="block font-bold mb-1 text-sm sm:text-base">New Password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full border-2 border-black border-r-2 sm:border-r-4 border-b-2 sm:border-b-4 rounded-md px-3 py-2 hover:scale-[1.007] transition-transform duration-200 text-sm sm:text-base"
                    />
                    <Button
                      className="mt-2 border-2 border-black font-bold text-sm sm:text-base px-3 sm:px-4 py-2"
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
                    {/* Password Update Status Messages */}
                    {passwordSuccess && (
                      <p className="text-green-600 font-semibold mt-2 text-sm sm:text-base">
                        {passwordSuccess}
                      </p>
                    )}
                    {passwordError && (
                      <p className="text-red-600 font-semibold mt-2 text-sm sm:text-base">
                        {passwordError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Sign In Button for Unauthenticated Users */
        <SignInButton mode="modal">
          <Button className="bg-darkBlue text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-sm sm:text-base md:text-lg font-lazyDog rounded-md z-[100]">
            Log In
          </Button>
        </SignInButton>
      )}
    </div>
  );
}
