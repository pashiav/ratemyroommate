import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Type definition for user school information
type UserSchoolInfo = {
  school_id: string;
  schools: {
    school_name: string;
  } | null;
};

export async function GET(req: Request) {
  // Extract user_id from query parameters
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  // Validate required user_id parameter
  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  // Initialize Supabase client with anon key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // First, check if the user exists
  const { data: userExists, error: userCheckError } = await supabase
    .from("users")
    .select("user_id")
    .eq("user_id", user_id)
    .maybeSingle();

  if (userCheckError) {
    console.error("Error checking if user exists:", userCheckError);
    return NextResponse.json({ 
      error: "Database error occurred while checking user" 
    }, { status: 500 });
  }

  if (!userExists) {
    return NextResponse.json({ 
      error: "User not found" 
    }, { status: 404 });
  }

  // Fetch user's school information with joined school details
  const { data, error } = await supabase
    .from("users")
    .select("school_id, schools(school_name)")
    .eq("user_id", user_id)
    .single<UserSchoolInfo>();

  if (error) {
    console.error("Error fetching user school info:", error);
    return NextResponse.json({ 
      error: "Failed to fetch user school information" 
    }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ 
      error: "User data not found" 
    }, { status: 404 });
  }

  // If user has no school_id, return a default response
  if (!data.school_id) {
    return NextResponse.json({ 
      school_name: "Other/General" 
    });
  }

  if (!data.schools) {
    return NextResponse.json({ 
      error: "School information not found" 
    }, { status: 404 });
  }

  return NextResponse.json({ school_name: data.schools.school_name });
}
