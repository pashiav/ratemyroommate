// app/api/waitlist/route.ts

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ message: "A valid email is required" }, { status: 400 });
  }

  const { error } = await supabase.from("waitlist").insert([{ email }]);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "You’re already on the list!" }, { status: 409 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "You’ve been added to the waitlist!" }, { status: 200 });
}
