import { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;

    if (eventType === "user.created") {
      const user = evt.data;

      const user_id = user.id;
      const email = user.email_addresses?.[0]?.email_address.toLowerCase() ?? "";
      const created_at = new Date(user.created_at).toISOString();
      const is_verified = true;
      const accepted_privacy_terms = false;
      const domain = email.split("@")[1]?.toLowerCase();

      let school_id: string | null = null;

      // Look up matching school in Supabase
      if (domain) {
        const { data: school, error: schoolError } = await supabase
          .from("schools")
          .select("school_id")
          .eq("domain", domain)
          .single();

        if (schoolError && schoolError.code !== "PGRST116") {
          console.error("Supabase school lookup error:", schoolError);
          return new Response("Supabase school lookup failed", { status: 500 });
        }
      }

      const { error } = await supabase.from("users").insert({
        user_id,
        email,
        created_at,
        is_verified,
        accepted_privacy_terms,
        school_id,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        return new Response("Supabase insert failed", { status: 500 });
      }

      console.log("User inserted into Supabase:", user_id);
    }

    return new Response("Webhook handled", { status: 200 });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
