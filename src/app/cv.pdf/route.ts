import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function publishedUrl() {
  const value = process.env.CV_PDF_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function missingPage() {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CV not published | Richard Winner Duvor</title>
<meta name="robots" content="noindex">
<style>
  body { margin: 0; background: #07090c; color: #e8edf2; font: 17px/1.6 ui-sans-serif, system-ui, sans-serif; }
  main { max-width: 40rem; margin: 14vh auto; padding: 24px; }
  h1 { font-size: 2.4rem; line-height: 1.05; letter-spacing: -0.03em; font-weight: 560; }
  a { color: #5eead4; }
  p { color: #9ba8b5; }
</style>
</head>
<body>
<main>
  <p>CV</p>
  <h1>The CV has not been published here yet.</h1>
  <p>Email me and I will send it.</p>
  <p><a href="mailto:duvorrichardwinner@gmail.com?subject=AppSec%20role">duvorrichardwinner@gmail.com</a></p>
  <p><a href="/">Back to home</a></p>
</main>
</body>
</html>`;
  return new NextResponse(html, {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

export async function GET() {
  const remote = publishedUrl();
  if (remote) {
    return NextResponse.redirect(remote, 307);
  }

  const file = path.join(process.cwd(), "public", "cv.pdf");
  if (existsSync(file)) {
    const bytes = await readFile(file);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Richard-Winner-Duvor-AppSec-CV.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  return missingPage();
}
