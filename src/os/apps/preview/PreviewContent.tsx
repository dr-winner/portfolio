/* Preview window content for Phase 1, fix 2 of the phase 1 review: the
   CV app. An iframe would need frame-src, which this site deliberately
   ships as none, so the window states the real Phase 2 scope and hands
   over the actual file today. */

export function PreviewContent() {
  return (
    <div className="wos-placeholder">
      <p className="wos-window-note">The rendered CV document view lands in Phase 2. The real file is linked below and always current.</p>
      <h3 className="wos-listhead">What Preview becomes</h3>
      <ul className="wos-aboutlist">
        <li>The CV rendered as a document inside this window</li>
        <li>The same content as the downloadable file, one source of truth</li>
        <li>No third party embeds, the frame-src header stays none by design</li>
      </ul>
      <p className="wos-window-actions">
        <a href="/cv.pdf" download className="wos-btn wos-btn-primary">
          Download CV
        </a>
      </p>
    </div>
  );
}
