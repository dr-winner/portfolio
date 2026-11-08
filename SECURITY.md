# Security notes

The portfolio is a static-first Next.js application with no runtime database, admin CMS, or file-upload surface.

- Content is authored in `src/content/*` and reviewed in Git.
- `/admin` and `/studio` return `404` with `X-Robots-Tag: noindex, nofollow, noarchive` and `Cache-Control: private, no-store`.
- Every document response carries a per-request CSP nonce (`script-src 'self' 'nonce-...' 'strict-dynamic'`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy: same-origin`, and `Permissions-Policy`.
- Vulnerability disclosure instructions live at `/security#report` and `/.well-known/security.txt`.

If legacy environment variables (`DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD`, `ADMIN_PATH`, `ANALYTICS_SALT`, `GROQ_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `GITHUB_TOKEN`) are still configured in hosting environments from earlier versions, remove them and revoke the backing credentials in their providers.
