import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json();
  const { first_name, last_name, user_id } = body;

  if (!user_id || !first_name || !last_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch school_id from the user's row
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("school_id")
    .eq("user_id", user_id)
    .single();

  if (userError || !userData?.school_id) {
    return NextResponse.json({ error: "School not found for user" }, { status: 404 });
  }

  const school_id = userData.school_id;

  // Insert roommate
  const { data, error } = await supabase
    .from("roommates")
    .insert([
      {
        first_name,
        last_name,
        school_id,
        created_by_user_id: user_id,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
