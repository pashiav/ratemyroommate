'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

interface ReviewFormProps {
  roommate_id: string;
}

export default function ReviewForm({ roommate_id }: ReviewFormProps) {
  const router = useRouter();
  const { userId, getToken, isLoaded, isSignedIn } = useAuth();
  
  const [rating, setRating] = useState<number>(5);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [hasPets, setHasPets] = useState<boolean | null>(null);
  const [petFriendly, setPetFriendly] = useState<boolean | null>(null);
  const [yearsLived, setYearsLived] = useState<number | null>(null);
  const [comments, setComments] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isSignedIn || !userId) {
      setError('You must be signed in to leave a review');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = await getToken();
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          would_recommend: wouldRecommend,
          has_pets: hasPets,
          pet_friendly: petFriendly,
          years_lived: yearsLived,
          comments,
          rm_id: roommate_id,
          reviewer_id: userId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccessMessage('Review submitted successfully!');
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push(`/roommate/${roommate_id}`);
        router.refresh(); // Force refresh to update the reviews
      }, 1500);
      
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  // Show sign-in prompt if user is not signed in
  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <p className="text-xl mb-4">You need to be signed in to leave a review</p>
          <Link 
            href={`/roommate/${roommate_id}`}
            className="inline-block bg-navy-blue text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 max-w-2xl mx-auto">
      <Link
        href={`/roommate/${roommate_id}`}
        className="inline-flex items-center text-navy-blue hover:underline mb-6"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Profile
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Leave a Review</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>{successMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none mr-1"
                aria-label={`Rate ${star} stars`}
              >
                <svg 
                  className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 self-center text-gray-600">{rating}/5</span>
          </div>
        </div>
        
        {/* Would Recommend */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Would you recommend this roommate?</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setWouldRecommend(true)}
              className={`px-4 py-2 rounded-md ${
                wouldRecommend === true
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setWouldRecommend(false)}
              className={`px-4 py-2 rounded-md ${
                wouldRecommend === false
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => setWouldRecommend(null)}
              className={`px-4 py-2 rounded-md ${
                wouldRecommend === null
                  ? 'bg-navy-blue text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Not Sure
            </button>
          </div>
        </div>
        
        {/* Has Pets */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Did they have pets?</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setHasPets(true)}
              className={`px-4 py-2 rounded-md ${
                hasPets === true ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setHasPets(false)}
              className={`px-4 py-2 rounded-md ${
                hasPets === false ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => setHasPets(null)}
              className={`px-4 py-2 rounded-md ${
                hasPets === null ? 'bg-navy-blue text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Not Sure
            </button>
          </div>
        </div>
        
        {/* Pet Friendly */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Were they pet-friendly?</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setPetFriendly(true)}
              className={`px-4 py-2 rounded-md ${
                petFriendly === true ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setPetFriendly(false)}
              className={`px-4 py-2 rounded-md ${
                petFriendly === false ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => setPetFriendly(null)}
              className={`px-4 py-2 rounded-md ${
                petFriendly === null ? 'bg-navy-blue text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              N/A
            </button>
          </div>
        </div>
        
        {/* Years Lived */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Years lived together
          </label>
          <input
            type="number"
            min="0"
            max="99"
            step="1"
            value={yearsLived || ''}
            onChange={(e) => setYearsLived(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter number of years"
          />
        </div>
        
        {/* Comments */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Comments
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md h-32"
            placeholder="Share your experience living with this roommate..."
          ></textarea>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-darkBlue text-white py-3 px-4 rounded-md hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}