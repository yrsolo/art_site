import { NextResponse, type NextRequest } from "next/server";

function allowedOrigins() {
  return Array.from(
    new Set(
      (process.env.ADMIN_ALLOWED_ORIGINS ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .concat([process.env.NEXT_PUBLIC_ADMIN_BASE_URL ?? "http://localhost:3001", "http://localhost:3001"]),
    ),
  );
}

function buildCorsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin || !allowedOrigins().includes(origin)) {
    return null;
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const corsHeaders = buildCorsHeaders(request);

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders ?? {},
    });
  }

  const response = NextResponse.next();

  if (corsHeaders) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
