import { NextResponse, type NextRequest } from "next/server";
import { adminPathSegment } from "@/lib/admin-href";
import { COOKIE_NAMES, verifySession } from "@/lib/session-token";

function buildCsp(nonce: string, isDev: boolean) {
  const script = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`;
  return [
    "default-src 'self'",
    script,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
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
  response.headers.set("Reporting-Endpoints", 'csp="/api/csp-report"');
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
  return new NextResponse("Not Found", { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow, noarchive", "Cache-Control": "private, no-store" } });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const nonce = btoa(crypto.randomUUID());
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-pathname", pathname);

  if (pathname === "/CV.pdf") {
    const url = req.nextUrl.clone();
    url.pathname = "/cv.pdf";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/studio" || pathname.startsWith("/studio/")) {
    return notFound();
  }

  const segment = adminPathSegment();
  if (segment && (pathname === `/${segment}` || pathname.startsWith(`/${segment}/`))) {
    const isLogin = pathname === `/${segment}/login`;
    const token = COOKIE_NAMES.map((name) => req.cookies.get(name)?.value).find(Boolean);
    const session = await verifySession(token);
    if (!isLogin && !session) return notFound();
    const url = req.nextUrl.clone();
    url.pathname = `/admin${pathname.slice(segment.length + 1)}`;
    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set("Cache-Control", "private, no-store");
    return applyDocumentHeaders(response, req, nonce);
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
