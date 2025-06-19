import ReviewForm from './review-form';
import TopFridge from '@/components/TopFridge';
import AuthHeader from '@/components/AuthHeader';

export default async function NewReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#315d8d] pl-[0.75rem] pr-[0.75rem] font-lazyDog">
      <TopFridge showSearchBar={true}>
        <AuthHeader />
        <div className="mt-[7rem]">
        <ReviewForm roommate_id={id} />
        </div>
      </TopFridge>
    </main>
  );
}