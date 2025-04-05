import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

type Props = {
  params: { id: string }
}

export async function GET(_: Request, { params }: Props) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  // Fetch roommate + place + reviews
  const { data, error } = await supabase
    .from("roommates")
    .select(`
      rm_id,
      name,
      school,
      unit_end,
      created_at,
      places (
        name
      ),
      reviews (
        rating,
        would_recomm,
        has_pets,
        pet_friendly,
        years_lived,
        comments,
        created_at
      )
    `)
    .eq("rm_id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
