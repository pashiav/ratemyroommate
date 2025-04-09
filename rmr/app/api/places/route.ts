import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { name, school } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check if environment variables exist
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Simple insert with service role client
    const { error } = await supabaseAdmin
      .from("places")
      .insert([{ name, school }]);
      
    if (error) {
      console.error("Insert error:", error.message);
      return NextResponse.json({ error: "Failed to add place." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function GET() {
    try {
      // Check if environment variables exist
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Missing Supabase environment variables");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
      }
  
      // Create admin client with service role key
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
  
      // Fetch places
      const { data, error } = await supabaseAdmin
        .from("places")
        .select("*");
        
      if (error) {
        console.error("Fetch error:", error.message);
        return NextResponse.json({ error: "Failed to fetch places." }, { status: 500 });
      }
  
      return NextResponse.json(data || [], { status: 200 });
    } catch (err) {
      console.error("Unexpected error:", err);
      return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
  }