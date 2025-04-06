import ReviewForm from './review-form';

export default async function NewReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#315d8d] pl-4 pr-4 font-lazyDog">
    <div className="bg-[#f5f5f5] rounded-[96px] shadow-lg p-8 min-h-screen">
      
        <ReviewForm roommate_id={id} />
      </div>
    </main>
  );
}
