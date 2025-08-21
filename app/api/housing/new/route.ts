import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  // Parse request body to extract housing name and user ID
  const body = await req.json();
  const { housing_name, user_id } = body;

  // Validate required fields
  if (!user_id || !housing_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Initialize Supabase client with anon key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch user's school ID to associate housing with correct institution
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("school_id")
    .eq("user_id", user_id)
    .single();

  if (userError || !userData?.school_id) {
    return NextResponse.json({ error: "School not found for user" }, { status: 404 });
  }

  const school_id = userData.school_id;

  // Normalize the housing name: trim whitespace and convert to lowercase
  const normalizedHousingName = housing_name.trim().toLowerCase();

  // Check if housing already exists for this school (case-insensitive and whitespace-insensitive)
  const { data: existingHousing, error: checkError } = await supabase
    .from("housing")
    .select("housing_id, housing_name, is_verified")
    .eq("school_id", school_id)
    .eq("is_deleted", false);

  if (checkError) {
    return NextResponse.json({ error: "Failed to check existing housing" }, { status: 500 });
  }

  // Check for duplicates (case-insensitive and whitespace-insensitive)
  const duplicateHousing = existingHousing?.find(housing => 
    housing.housing_name.trim().toLowerCase() === normalizedHousingName
  );

  // If housing already exists, return error message and DO NOT create
  if (duplicateHousing) {
    return NextResponse.json({ 
      error: `Housing "${duplicateHousing.housing_name}" already exists for this school`,
      is_existing: true,
      duplicate_name: duplicateHousing.housing_name,
      normalized_input: normalizedHousingName
    }, { status: 409 }); // 409 Conflict status for duplicates
  }

  // Only create new housing if no duplicate exists
  const { data, error } = await supabase
    .from("housing")
    .insert([
      {
        housing_name: housing_name.trim(), // Store the original trimmed name
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
    message: "Housing created successfully",
    is_existing: false
  }, { status: 201 });
}
