"use client";

import TopFridge from "@/components/TopFridge";
import AuthHeader from "@/components/AuthHeader";
import SearchBar from "@/components/SearchBar";

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#315d8d] pl-[0.75rem] pr-[0.75rem]">
      <TopFridge showSearchBar={false}>
        <AuthHeader />
        <div className="flex flex-col items-center gap-6 mt-[13.5rem]">
          <h1 className="text-[8rem] text-darkBlue text-center leading-none">
            Search
          </h1>
          <p className="text-lg text-darkBlue text-center -mt-7">
            Search for a roommate or housing.
          </p>
          <SearchBar />
        </div>
      </TopFridge>
    </main>
  );
}