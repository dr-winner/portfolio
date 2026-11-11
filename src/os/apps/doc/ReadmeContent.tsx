import Link from "next/link";

/* The README document window content, opened by the README.md desktop
   icon. It states what this site is and what Phase 1 covers, with only
   real links. No invented roadmap, no fake features. */

export function ReadmeContent() {
  return (
    <div className="wos-docview">
      <p className="wos-window-note">README.md</p>
      <h3 className="wos-listhead">What this site is</h3>
      <p className="wos-docpara">
        A portfolio in two views. The classic view is a plain document with every section, and it works without JavaScript. The
        desktop view is winnerOS, a menu bar, a dock, windows and a session that restores where you left off.
      </p>
      <h3 className="wos-listhead">What Phase 1 covers</h3>
      <p className="wos-docpara">
        The foundation only: the window manager, the Welcome window, the temporary Hello proof app, search, the switcher and the
        phone home screen. Files, Terminal, Proxy and the Agent Lab open as scoped placeholders until Phase 2 builds them.
      </p>
      <h3 className="wos-listhead">Read next</h3>
      <ul className="wos-aboutlist">
        <li>
          <Link href="/work?view=classic" className="wos-fileslink" data-wos-open="files">
            Files, the project index
          </Link>
        </li>
        <li>
          <Link href="/security?view=classic" className="wos-fileslink" data-wos-open="security">
            How this site is secured
          </Link>
        </li>
        <li>
          <a href="/cv.pdf" download className="wos-fileslink">
            The CV as a file
          </a>
        </li>
      </ul>
    </div>
  );
}
