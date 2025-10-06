"use client";

import TopFridge from "@/components/TopFridge";
import AuthHeader from "@/components/AuthHeader";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";

// Main search page component with search interface
export default function SearchPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#315d8d] px-3 sm:px-4 md:px-6 lg:pl-[0.75rem] lg:pr-[0.75rem]">
        <TopFridge showSearchBar={false}>
          <AuthHeader />
          {/* Search page content with title, description, and search bar */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 mt-[6rem] sm:mt-[7rem] md:mt-[10rem] lg:mt-[13.5rem] px-2 sm:px-4">
            <h1 className="text-[3rem] xs:text-[3.5rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] xl:text-[7rem] 2xl:text-[8rem] text-darkBlue text-center leading-none">
              Search
            </h1>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-darkBlue text-center -mt-4 sm:-mt-5 md:-mt-6 lg:-mt-7 px-2">
              Search for a roommate or housing.
            </p>
            <div className="flex justify-center items-center w-full max-w-4xl px-2 sm:px-4">
              <SearchBar />
            </div>
          </div>
        </TopFridge>
        <Footer />
      </main>
    </AuthGuard>
  );
}