import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";

export async function POST() {
    const supabase = await createClient();
    await supabase.auth.signOut();

    return NextResponse.redirect(new URL("/", SITE_URL), {
        status: 302,
    });
}

export async function GET(request: Request) {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/`);
}
