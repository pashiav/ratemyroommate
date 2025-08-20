import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify user authentication using Clerk
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract housing ID from route parameters
  const { id } = await params;

  // Initialize Supabase client with anonymous key for read operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch specific housing details including location coordinates and verification status
  const { data, error } = await supabase
    .from("housing_search_view")
    .select("housing_id, housing_name, school_name, is_verified, latitude, longitude")
    .eq("housing_id", id.trim())
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Housing not found" },
      { status: error ? 500 : 404 }
    );
  }

  return NextResponse.json(data);
}
