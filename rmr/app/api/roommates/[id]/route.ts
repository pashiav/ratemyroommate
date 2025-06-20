import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

// Updated type signature for Next.js 15
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Note the change here - we need to await params
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Get roommate
  const { data: roommate, error: roommateError } = await supabase
    .from("roommates")
    .select("rm_id, full_name")
    .eq("rm_id", id.trim())
    .single();

  if (roommateError || !roommate) {
    return NextResponse.json(
      { error: roommateError?.message ?? "Roommate not found" },
      { status: roommateError ? 500 : 404 }
    );
  }

  // Get their reviews
  const { searchParams } = new URL(request.url);
  const housing_id = searchParams.get("housing_id");
  const unit_suffix = searchParams.get("unit_suffix");

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select(
      `
    rv_id,
    rating,
    would_recommend,
    has_pets,
    pet_friendly,
    years_lived,
    comments,
    created_at,
    unit_suffix,
    noise_level,
    cleanliness,
    communication,
    responsibility,
    sleep_pattern,
    guest_frequency,
    study_compatibility,
    pet_type,
    pet_impact,
    housing_id
  `
    )
    .eq("rm_id", id)
    .eq("housing_id", housing_id)
    .eq("unit_suffix", unit_suffix)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (reviewsError) {
    return NextResponse.json({ error: reviewsError.message }, { status: 500 });
  }
  console.log("Fetched reviews:", reviews);

  return NextResponse.json({
    roommate: {
      ...roommate,
      reviews,
    },
  });
}
