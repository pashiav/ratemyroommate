import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [roommatesCount, reviewsCount, avgRating] = await Promise.all([
    supabase.from("roommates").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("rating")
  ])

  const ratings = avgRating.data?.map(r => r.rating) || []
  const average =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : null

  return NextResponse.json({
    roommates: roommatesCount.count || 0,
    reviews: reviewsCount.count || 0,
    average_rating: average?.toFixed(2) || "N/A"
  })
}
