import ReviewForm from './review-form';
import TopFridge from '@/components/TopFridge';
import AuthHeader from '@/components/AuthHeader';
import AuthGuard from '@/components/AuthGuard';
import Footer from '@/components/Footer';
// New review page component for creating roommate reviews
export default async function NewReviewPage({ params }: { params: Promise<{ id: string }> }) {
  // Extract roommate ID from route parameters
  const { id } = await params;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#315d8d] pl-[0.75rem] pr-[0.75rem] font-lazyDog">
        <TopFridge showSearchBar={true} back={true}>
          <AuthHeader />
          {/* Render review form with roommate ID */}
          <div className="mt-[7rem]">
          <ReviewForm roommate_id={id} />
          </div>
        </TopFridge>
        <Footer />
      </main>
    </AuthGuard>
  );
}