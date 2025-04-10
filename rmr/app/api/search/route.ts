import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { searchType, roommateName, location } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Missing Supabase configuration" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    let data = [];

    if (searchType === "roommate") {
      const { data: results, error } = await supabase.from("roommates").select(`
        *,
        places:places_id (
          name,
          school
        ),
        reviews:rm_id (
          rating,
          would_recommend,
          has_pets,
          pet_friendly,
          years_lived,
          comments
        )
      `);

      if (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Search error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
      }

      // Manual filtering
      const filtered = results?.filter((roommate) => {
        const matchesName = roommateName
          ? roommate.name?.toLowerCase().includes(roommateName.toLowerCase())
          : true;

        const matchesLocation = location
          ? roommate.places?.name
              ?.toLowerCase()
              .includes(location.toLowerCase())
          : true;

        return matchesName && matchesLocation;
      });

      data = filtered;
    } else if (searchType === "place") {
      const { data: results, error } = await supabase
        .from("places")
        .select(`
          *,
          roommates:places_id (
            count
          )
        `)
        .ilike("name", `%${location}%`);

      if (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Search error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
      }
        return NextResponse.json(results);

    } else {
      return NextResponse.json(
        { error: "Invalid search type" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      {
        error: `Unexpected error: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchType = url.searchParams.get("type");
  const roommateName = url.searchParams.get("roommateName");
  const location = url.searchParams.get("location");

  if (!searchType) {
    return NextResponse.json(
      { error: "Missing search type" },
      { status: 400 }
    );
  }

  const mockRequest = {
    json: async () => ({ searchType, roommateName, location }),
  } as Request;

  return POST(mockRequest);
}
