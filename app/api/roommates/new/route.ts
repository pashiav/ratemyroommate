import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  // Parse request body to extract roommate information
  const body = await req.json();
  const { first_name, last_name, user_id } = body;

  // Validate required fields
  if (!user_id || !first_name || !last_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Initialize Supabase client with anon key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch user's school ID to associate roommate with correct institution
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("school_id")
    .eq("user_id", user_id)
    .single();

  if (userError || !userData?.school_id) {
    return NextResponse.json({ error: "School not found for user" }, { status: 404 });
  }

  const school_id = userData.school_id;

  // Normalize the names: trim whitespace and convert to lowercase
  const normalizedFirstName = first_name.trim().toLowerCase();
  const normalizedLastName = last_name.trim().toLowerCase();

  // Check if roommate already exists for this school (case-insensitive and whitespace-insensitive)
  const { data: existingRoommates, error: checkError } = await supabase
    .from("roommates")
    .select("rm_id, first_name, last_name, full_name")
    .eq("school_id", school_id)
    .eq("is_deleted", false);

  if (checkError) {
    return NextResponse.json({ error: "Failed to check existing roommate" }, { status: 500 });
  }

  // Check for duplicates (case-insensitive and whitespace-insensitive)
  const duplicateRoommate = existingRoommates?.find(roommate => 
    roommate.first_name.trim().toLowerCase() === normalizedFirstName &&
    roommate.last_name.trim().toLowerCase() === normalizedLastName
  );

  // If roommate already exists, return error message and DO NOT create
  if (duplicateRoommate) {
    return NextResponse.json({ 
      error: `Roommate "${duplicateRoommate.full_name}" already exists for this school`,
      is_existing: true,
      duplicate_name: duplicateRoommate.full_name,
      normalized_input: `${normalizedFirstName} ${normalizedLastName}`
    }, { status: 409 }); // 409 Conflict status for duplicates
  }

  // Only create new roommate if no duplicate exists
  const { data, error } = await supabase
    .from("roommates")
    .insert([
      {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        school_id,
        created_by_user_id: user_id,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    data, 
    message: "Roommate created successfully",
    is_existing: false
  }, { status: 201 });
}
