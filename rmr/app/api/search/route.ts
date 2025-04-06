import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { searchType, searchQuery } = await req.json();
    console.log("Received:", { searchType, searchQuery });

    if (!searchQuery || !searchType) {
      return NextResponse.json({ error: "Missing searchType or searchQuery" }, { status: 400 });
    }

    const supabase = await createClient();

    if (searchType === "roommate") {
      const { data, error } = await supabase
        .from("roommates")
        .select("*, places(name)")
        .ilike("name", `%${searchQuery}%`);

      if (error) {
        console.error("Supabase roommate search error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    if (searchType === "place") {
      const { data, error } = await supabase
        .from("places")
        .select("*, roommates(*)")
        .ilike("name", `%${searchQuery}%`);

      if (error) {
        console.error("Supabase place search error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid searchType" }, { status: 400 });
  } catch (err) {
    console.error("Unhandled search API error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
