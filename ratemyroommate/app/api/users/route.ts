import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const email = sessionClaims?.email as string
  const name = sessionClaims?.name as string

  // Try to find user by Clerk user ID
  let { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single()

  // If user not found, insert into Supabase users table
  if (!user && email) {
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        user_id: userId,
        email,
        name,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    user = newUser
  }

  return NextResponse.json(user)
}
