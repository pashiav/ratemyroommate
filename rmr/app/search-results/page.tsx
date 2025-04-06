import { Suspense } from 'react';
import SearchResultsClient from './search-results-client';

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading search results...</div>}>
      <SearchResultsClient />
    </Suspense>
  );
}