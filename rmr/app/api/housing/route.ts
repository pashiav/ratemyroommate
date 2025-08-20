import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  // Verify user authentication using Clerk
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Initialize Supabase client with anonymous key for read operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch all housing options with school information and verification status
  const { data, error } = await supabase
    .from("housing_search_view")
    .select("housing_id, housing_name, school_name, is_verified");

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Failed to load housing options" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
