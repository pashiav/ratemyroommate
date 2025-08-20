import { Suspense } from 'react';
import SearchResultsClient from './search-results-client';

// Search results page wrapper with suspense boundary
export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading search results...</div>}>
      <SearchResultsClient />
    </Suspense>
  );
}