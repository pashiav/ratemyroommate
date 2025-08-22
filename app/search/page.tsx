"use client";

import TopFridge from "@/components/TopFridge";
import AuthHeader from "@/components/AuthHeader";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";

// Main search page component with search interface
export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#315d8d] pl-[0.75rem] pr-[0.75rem]">
      <TopFridge showSearchBar={false}>
        <AuthHeader />
        {/* Search page content with title, description, and search bar */}
        <div className="flex flex-col items-center gap-6 mt-[8rem] md:mt-[13.5rem]">
          <h1 className="text-[4rem] xs:text-[5rem] sm:text-[6rem] md:text-[7rem] lg:text-[8rem] text-darkBlue text-center leading-none">
            Search
          </h1>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-darkBlue text-center -mt-7">
            Search for a roommate or housing.
          </p>
          <div className="flex justify-center items-center">
            <SearchBar />
          </div>
        </div>
      </TopFridge>
      <Footer />
    </main>
  );
}