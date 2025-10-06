"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import SearchForm from "./SearchForm";

// Responsive search icon component that shows a search icon on mobile
// and opens a modal with the SearchForm when clicked
export default function ResponsiveSearchIcon() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // State management for search parameters
  const [searchType, setSearchType] = useState("roommate");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  // Close modal when screen size changes to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024 && isModalOpen) {
        // lg breakpoint is 1024px
        setIsModalOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isModalOpen]);

  // Handle search submission and navigation
  const handleSearch = async () => {
    const query = searchQuery.trim();
    const location = locationQuery.trim();

    // Validate search parameters based on type
    if (searchType === "roommate" && !query && !location) return;
    if (searchType === "housing" && !location) return;

    try {
      // Build query parameters for search results page
      const queryParams = new URLSearchParams();
      queryParams.append("type", searchType);
      if (searchType === "roommate") {
        if (query) queryParams.append("roommateName", query);
        if (location) queryParams.append("location", location);
      } else {
        queryParams.append("location", location);
      }

      // Close modal and navigate to search results page
      setIsModalOpen(false);
      window.location.href = `/search-results?${queryParams.toString()}`;
    } catch (err) {
      console.error("Error hitting search API:", err);
    }
  };

  return (
    <>
      {/* Search Icon Button - Visible on mobile/tablet */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="lg:hidden bg-darkBlue text-white w-8 h-8 rounded-full hover:bg-blue-900 flex items-center justify-center transition transform hover:scale-105"
        aria-label="Open search"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
      </button>

      {/* Full Search Form - Visible on desktop */}
      <div className="hidden lg:block">
        <SearchForm
          searchType={searchType}
          searchQuery={searchQuery}
          locationQuery={locationQuery}
          setSearchType={setSearchType}
          setSearchQuery={setSearchQuery}
          setLocationQuery={setLocationQuery}
          onSearch={handleSearch}
        />
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="w-[63vw] fixed top-[4rem] left-1/2 -translate-x-1/2 h-screen z-50 flex items-start justify-center">
            <div className="bg-white w-full max-h-[90vh] rounded-lg shadow-2xl">
            <div
              ref={modalRef}
              className="bg-white rounded-lg p-3 sm:p-4 w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-darkBlue">Search</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close search modal"
                >
                  ×
                </button>
              </div>

              {/* Search Form in Modal */}
              <div className="w-full">
                <SearchForm
                  searchType={searchType}
                  searchQuery={searchQuery}
                  locationQuery={locationQuery}
                  setSearchType={setSearchType}
                  setSearchQuery={setSearchQuery}
                  setLocationQuery={setLocationQuery}
                  onSearch={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
