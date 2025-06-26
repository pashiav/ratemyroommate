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

  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    <div className="absolute top-0 right-0 mt-[3rem] mr-[6rem] z-100">
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
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                onClick={() => {
                  setShowDropdown(false);
                  setShowAccountModal(true);
                }}
              >
                Manage Account
              </button>
              <hr className="mx-2 my-1 border-gray-200" />
              <button
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded"
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
              <div ref={modalRef} className="relative w-[30rem] h-[30rem] bg-white p-6 rounded-xl shadow-lg flex flex-col border-2 border-black border-r-8 border-b-8">
                <button
                  className="absolute top-3 right-6 text-gray-500 hover:text-gray-700 text-3xl font-sans"
                  onClick={() => setShowAccountModal(false)}
                >
                  &times;
                </button>

                <h2 className="text-2xl font-bold mb-6">
                  Account
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block font-bold mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={user?.primaryEmailAddress?.emailAddress || ""}
                      readOnly
                      className="w-full border-2 border-black border-r-4 border-b-4 rounded-md px-3 py-2 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">New Password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full border-2 border-black border-r-4 border-b-4 rounded-md px-3 py-2 hover:scale-[1.007] transition-transform duration-200"
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
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <SignInButton mode="modal">
          <Button className="bg-darkBlue text-white px-6 py-2 text-lg font-lazyDog rounded-md z-1000">
            Log In
          </Button>
        </SignInButton>
      )}
    </div>
  );
}
