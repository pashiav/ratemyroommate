import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type UserSchoolInfo = {
  school_id: string;
  schools: {
    school_name: string;
  } | null;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

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
