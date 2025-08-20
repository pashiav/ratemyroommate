import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  // Verify user authentication using Clerk
  const { userId } = await auth();
  if (!userId) {
    console.warn("Unauthorized access attempt");
    return NextResponse.json(
      { error: "Unauthorized access attempt" },
      { status: 401 }
    );
  }

  // Initialize Supabase client with anonymous key for read operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Extract search parameters from query string
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const roommateName = searchParams.get("roommateName");
  const location = searchParams.get("location");

  let query;

  // Build search query based on type (roommate or housing)
  if (type === "roommate") {
    query = supabase.from("roommate_search_view").select("*");

    // Apply roommate name filter if provided
    if (roommateName) {
      query = query.ilike("full_name", `%${roommateName}%`);
    }
    // Apply location filter if provided
    if (location) {
      query = query.ilike("housing_name", `%${location}%`);
    }
  } else if (type === "housing") {
    query = supabase.from("housing_search_view").select("*");

    // Apply location filter if provided
    if (location) {
      query = query.ilike("housing_name", `%${location}%`);
    }
  } else {
    // Return empty array for unsupported search types
    return NextResponse.json([], { status: 200 });
  }

  // Execute search query and handle results
  const { data, error } = await query;

  if (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
