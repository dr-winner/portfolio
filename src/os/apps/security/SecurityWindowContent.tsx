/* Security window content for the OS view of /security, fix 1 of the
   phase 1 review. Only facts the middleware actually sets: the header list
   below mirrors src/middleware.ts. The full report with the response
   header walkthrough and the browser checks stays in the classic view. */

export function SecurityWindowContent() {
  return (
    <div className="wos-secview">
      <p className="wos-window-note">
        The site ships a strict header set on every response. The full report with the walkthrough lives in the
        classic view.
      </p>
      <section className="wos-filesgroup">
        <h3 className="wos-listhead">In place on every response</h3>
        <ul className="wos-aboutlist">
          <li>Content Security Policy with a per request nonce and strict-dynamic</li>
          <li>X-Frame-Options DENY with frame-src none and frame-ancestors none</li>
          <li>Strict-Transport-Security with two year max age and preload</li>
          <li>X-Content-Type-Options nosniff</li>
          <li>Referrer-Policy strict-origin-when-cross-origin</li>
          <li>Permissions-Policy locking camera, microphone and geolocation</li>
          <li>Cross-Origin-Opener-Policy same-origin</li>
        </ul>
      </section>
      <section className="wos-filesgroup">
        <h3 className="wos-listhead">Report an issue</h3>
        <ul className="wos-aboutlist">
          <li>
            <a href="/.well-known/security.txt" className="wos-fileslink">
              security.txt
            </a>
          </li>
          <li>
            <a href="mailto:duvorrichardwinner@gmail.com" className="wos-fileslink">
              duvorrichardwinner@gmail.com
            </a>
          </li>
        </ul>
      </section>
      <p className="wos-window-actions">
        <a href="/security?view=classic" className="wos-btn wos-btn-ghost">
          Open the full security report
        </a>
      </p>
    </div>
  );
}
