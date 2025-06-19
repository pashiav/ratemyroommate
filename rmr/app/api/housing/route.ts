import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("housing_search_view")
    .select("housing_id, housing_name, school_name, is_verified");

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Failed to load housing options" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
