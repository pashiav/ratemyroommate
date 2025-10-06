import React from "react";

export default function Footer() {
  return (
    <footer className="bg-darkBlue text-white py-12 px-4 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* App branding */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/logo.png" alt="Rate My Roommate" className="w-auto h-12" />
              <h3 className="text-xl font-bold font-lazyDog">Rate My Roommate</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Helping students find the perfect roommate through honest, verified reviews.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-rosePink">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/search" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Search Roommates
                </a>
              </li>
              <li>
                <a href="/roommate/new" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Add Roommate
                </a>
              </li>
              <li>
                <a href="/housing/new" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Add Housing
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-rosePink">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-rosePink">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/pashiav/ratemyroommate" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 4.624-5.479 4.869.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Rate My Roommate. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Made for students.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
