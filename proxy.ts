import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_HOME: Record<string, string> = {
  admin:   "/admin/dashboard",
  partner: "/partner/dashboard",
  student: "/student/dashboard",
};

const PROTECTED: Record<string, string> = {
  "/admin":   "admin",
  "/partner": "partner",
  "/student": "student",
};

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Login pages are never protected
  const LOGIN_PAGES = ["/admin/login", "/auth/partner", "/auth/student"];
  if (LOGIN_PAGES.includes(path)) {
    // Already logged in → redirect to dashboard
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile) {
        return NextResponse.redirect(new URL(ROLE_HOME[profile.role as string], request.url));
      }
    }
    return response;
  }

  // Check if the path is protected
  for (const [prefix, requiredRole] of Object.entries(PROTECTED)) {
    if (path.startsWith(prefix)) {
      if (!user) {
        // Not logged in → redirect to login
        const loginMap: Record<string, string> = {
          admin:   "/admin/login",
          partner: "/auth/partner",
          student: "/auth/student",
        };
        return NextResponse.redirect(new URL(loginMap[requiredRole], request.url));
      }

      // Check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== requiredRole) {
        // Wrong role → redirect to correct dashboard
        const redirect = profile ? ROLE_HOME[profile.role] : "/";
        return NextResponse.redirect(new URL(redirect, request.url));
      }

      break;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/partner/:path*",
    "/student/:path*",
    "/auth/:path*",
  ],
};
