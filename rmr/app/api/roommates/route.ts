import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, unitEnding, placeId, school } = body;

    console.log("Received request:", { name, unitEnding, placeId, school });

    if (!name || !unitEnding || !placeId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get Supabase credentials from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Create Supabase client with proper arguments
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Convert unitEnding to a number
    const unitEndNumber = parseInt(unitEnding, 10);
    
    if (isNaN(unitEndNumber)) {
      return NextResponse.json({ error: "Unit ending must be a number" }, { status: 400 });
    }

    // Create object with required fields
    const insertData = { 
      name, 
      unit_end: unitEndNumber,
      places_id: placeId 
    };

    // Add school if provided
    if (school) {
      Object.assign(insertData, { school });
    }

    const { data, error } = await supabase
      .from("roommates")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ roommate: data }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ 
      error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` 
    }, { status: 500 });
  }
}