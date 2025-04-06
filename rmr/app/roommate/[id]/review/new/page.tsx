// app/roommate/[id]/review/new/page.tsx
import ReviewForm from './review-form';

export default function NewReviewPage({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col bg-blue-50 p-4">
      <div className="max-w-3xl mx-auto w-full my-8">
        <ReviewForm roommate_id={params.id} />
      </div>
    </main>
  );
}