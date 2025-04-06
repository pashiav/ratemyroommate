import { type Metadata } from 'next';
import ReviewForm from './review-form';

type PageProps = {
  params: {
    id: string;
  };
};

export default function NewReviewPage({ params }: PageProps) {
  return (
    <main className="flex min-h-screen flex-col bg-blue-50 p-4">
      <div className="max-w-3xl mx-auto w-full my-8">
        <ReviewForm roommate_id={params.id} />
      </div>
    </main>
  );
}
