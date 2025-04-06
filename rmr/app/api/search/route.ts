import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { searchQuery, searchType } = await req.json();
    
    // Get Supabase credentials from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using service role to bypass RLS
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 });
    }
    
    // Create Supabase client with service role to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    let data = [];
    
    if (searchType === "roommate") {
      // For roommate searches, join with places and reviews tables
      const { data: results, error } = await supabase
        .from("roommates")
        .select(`
          *,
          places:places_id (
            name,
            school
          ),
          reviews:rm_id (
            rating,
            would_recommend,
            has_pets,
            pet_friendly,
            years_lived,
            comments
          )
        `)
        .ilike("name", `%${searchQuery}%`);
      
      if (error) {
        console.error("Search error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      data = results;
    } else if (searchType === "place") {
      // For place searches
      const { data: results, error } = await supabase
        .from("places")
        .select(`
          *,
          roommates:places_id (
            count
          )
        `)
        .ilike("name", `%${searchQuery}%`);
      
      if (error) {
        console.error("Search error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      data = results;
    } else {
      // Invalid search type
      return NextResponse.json({ error: "Invalid search type" }, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ 
      error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` 
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get("query");
  const searchType = url.searchParams.get("type");
  
  if (!searchQuery || !searchType) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }
  
  const mockRequest = {
    json: async () => ({ searchQuery, searchType })
  } as Request;
  
  return POST(mockRequest);
}