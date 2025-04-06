import ReviewForm from './review-form';

export default async function NewReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="flex min-h-screen flex-col bg-blue-50 p-4">
      <div className="max-w-3xl mx-auto w-full my-8">
        <ReviewForm roommate_id={id} />
      </div>
    </main>
  );
}
