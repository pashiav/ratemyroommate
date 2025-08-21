import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Test basic connection
  const { data: testData, error: testError } = await supabase
    .from("schools")
    .select("school_id, school_name")
    .limit(1);

  if (testError) {
    return NextResponse.json({ 
      error: "Database connection failed", 
      details: testError.message 
    }, { status: 500 });
  }

  // Test users table access
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("user_id, school_id")
    .eq("user_id", user_id)
    .maybeSingle();

  if (userError) {
    return NextResponse.json({ 
      error: "Users table access failed", 
      details: userError.message 
    }, { status: 500 });
  }

  // Test schools join
  let schoolData = null;
  if (userData?.school_id) {
    const { data: school, error: schoolError } = await supabase
      .from("schools")
      .select("school_id, school_name")
      .eq("school_id", userData.school_id)
      .single();

    if (schoolError) {
      return NextResponse.json({ 
        error: "Schools table access failed", 
        details: schoolError.message 
      }, { status: 500 });
    }
    schoolData = school;
  }

  return NextResponse.json({
    success: true,
    test_connection: "OK",
    user_found: !!userData,
    user_data: userData,
    school_data: schoolData,
    user_id: user_id
  });
}
