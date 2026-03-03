import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login", "/auth/callback", "/api/billing/webhook", "/privacy", "/terms", "/refund-policy"];

// Static/asset prefixes to skip entirely
const SKIP_PREFIXES = ["/_next", "/favicon", "/icon", "/apple-touch-icon", "/manifest", "/opengraph-image", "/twitter-image", "/robots", "/sitemap"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static assets
    if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh the session (important to keep tokens valid)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Check if the route requires authentication
    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (!user && !isPublicRoute) {
        // If it's an API route, return 401 JSON instead of redirecting to login
        if (pathname.startsWith("/api/")) {
            return NextResponse.json(
                { error: "Session expired or unauthorized" },
                { status: 401 }
            );
        }

        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.searchParams.set("modal", "auth");
        return NextResponse.redirect(url);
    }

    // If user is logged in and visits /login, redirect to home
    if (user && pathname === "/login") {
        const url = request.nextUrl.clone();
        url.pathname = "/studio";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
