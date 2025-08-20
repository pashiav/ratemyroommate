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

  // Initialize Supabase client with service role key for admin operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch user's school information with joined school details
  const { data, error } = await supabase
    .from("users")
    .select("school_id, schools(school_name)")
    .eq("user_id", user_id)
    .single<UserSchoolInfo>();

  if (error || !data || !data.schools) {
    return NextResponse.json({ error: "User or school not found" }, { status: 404 });
  }

  return NextResponse.json({ school_name: data.schools.school_name });
}
