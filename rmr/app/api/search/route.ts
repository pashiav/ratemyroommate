import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  // Authentication
  const { userId } = await auth();
  if (!userId) {
    console.warn("Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized access attempt" }, { status: 401 });
  }

  // Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Query params
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const roommateName = searchParams.get("roommateName");
  const location = searchParams.get("location");

  let query;

  if (type === "roommate") {
    query = supabase.from("roommate_search_view").select("*");

    if (roommateName) {
      query = query.ilike("full_name", `%${roommateName}%`);
    }
    if (location) {
      query = query.ilike("housing_name", `%${location}%`);
    }

  } else if (type === "housing") {
    query = supabase.from("housing_search_view").select("*");

    if (location) {
      query = query.ilike("housing_name", `%${location}%`);
    }
    console.log("Searching housing with location:", location);
    


  } else {
    return NextResponse.json([], { status: 200 });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
