import { NextResponse, type NextRequest } from "next/server";

function buildCsp(nonce: string, isDev: boolean) {
  const script = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`;
  return [
    "default-src 'self'",
    script,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self' https://vitals.vercel-insights.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    ...(isDev || !process.env.VERCEL ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

function applyDocumentHeaders(response: NextResponse, req: NextRequest, nonce: string) {
  const isDev = process.env.NODE_ENV !== "production";
  const csp = buildCsp(nonce, isDev);
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=(), interest-cohort=()"
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  const path = req.nextUrl.pathname;
  const shared = path.includes("opengraph-image") || path === "/cv.pdf";
  response.headers.set("Cross-Origin-Resource-Policy", shared ? "cross-origin" : "same-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  if (process.env.VERCEL) {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  return response;
}

function notFound() {
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "Cache-Control": "private, no-store",
    },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const nonce = btoa(crypto.randomUUID());
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-pathname", pathname);

  // Internal view switch, brief 7.1: the ?view=classic param and the
  // /classic path map to an x-view request header so pages pick their frame
  // server side. No response header changes, the CSP byte stream is
  // identical for both views.
  if (req.nextUrl.searchParams.get("view") === "classic" || pathname === "/classic" || pathname.startsWith("/classic/")) {
    requestHeaders.set("x-view", "classic");
  }

  // Normalize a mistyped uppercase CV path to the real file.
  if (pathname === "/CV.pdf") {
    return NextResponse.redirect(new URL("/cv.pdf", req.nextUrl), 308);
  }

  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/studio" ||
    pathname.startsWith("/studio/")
  ) {
    return notFound();
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  return applyDocumentHeaders(response, req, nonce);
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|icon.svg|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
