import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const roommateName = searchParams.get("roommateName");
  const location = searchParams.get("location");

  // default to no filters
  let query = supabase.from("roommate_search_view").select("*");

  // filter only if "type" is roommate - otherwise this endpoint does nothing
  if (type === "roommate") {
    if (roommateName) {
      query = query.ilike("full_name", `%${roommateName}%`);
    }
    if (location) {
      query = query.ilike("housing_name", `%${location}%`);
    }
  } else {
    // Optionally, return nothing for unsupported types like "housing"
    return NextResponse.json([], { status: 200 });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
