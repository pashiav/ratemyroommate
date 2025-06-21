import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const raw_housing_id = searchParams.get("housing_id");
  const raw_unit_suffix = searchParams.get("unit_suffix");

  const housing_id =
    raw_housing_id && raw_housing_id !== "null" ? raw_housing_id : null;
  const unit_suffix =
    raw_unit_suffix && raw_unit_suffix !== "null" ? raw_unit_suffix : null;
  const rm_id = searchParams.get("rm_id");

  if (!rm_id) {
    return NextResponse.json({ error: "Missing rm_id" }, { status: 400 });
  }

  const { data: roommate, error: roommateError } = await supabase
    .from("roommates")
    .select("rm_id, full_name")
    .eq("rm_id", rm_id.trim())
    .maybeSingle();

  if (roommateError || !roommate) {
    return NextResponse.json(
      { error: roommateError?.message ?? "Roommate not found" },
      { status: roommateError ? 500 : 404 }
    );
  }

  let reviewQuery = supabase
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
    .eq("rm_id", rm_id)
    .eq("is_deleted", false);

  if (housing_id) {
    reviewQuery = reviewQuery.eq("housing_id", housing_id);
  }
  if (unit_suffix) {
    reviewQuery = reviewQuery.eq("unit_suffix", unit_suffix);
  }

  reviewQuery = reviewQuery.order("created_at", { ascending: false });

  const { data: reviews, error: reviewsError } = await reviewQuery;

  if (reviewsError) {
    return NextResponse.json({ error: reviewsError.message }, { status: 500 });
  }

  return NextResponse.json({
    roommate: {
      ...roommate,
      reviews: reviews ?? [],
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      reviewer_id,
      rm_id,
      housing_id,
      rating,
      would_recommend,
      has_pets,
      pet_friendly,
      years_lived,
      comments,
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
    } = body;

    if (
      !reviewer_id ||
      !rm_id ||
      !housing_id ||
      typeof rating !== "number" ||
      typeof would_recommend !== "boolean" ||
      typeof has_pets !== "boolean" ||
      !years_lived ||
      !comments ||
      typeof noise_level !== "number" ||
      typeof cleanliness !== "number" ||
      typeof communication !== "number" ||
      typeof responsibility !== "number" ||
      !sleep_pattern ||
      !guest_frequency ||
      !study_compatibility
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: userRow, error: userError } = await supabase
      .from("users")
      .select("school_id")
      .eq("user_id", reviewer_id)
      .maybeSingle();

    if (userError || !userRow?.school_id) {
      console.error("Failed to fetch user's school_id:", userError);
      return NextResponse.json(
        { error: "Could not resolve user's school ID" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from("reviews").insert([
      {
        rm_id,
        school_id: userRow.school_id,
        housing_id,
        rating,
        would_recommend,
        has_pets,
        pet_friendly,
        years_lived,
        comments,
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
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit review: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, review: data?.[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
