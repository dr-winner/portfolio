/* Boot sequence, brief 2.1: a server rendered overlay animated with CSS
   keyframes only, so it plays before hydration and never waits on
   JavaScript. One nonce carrying inline script runs before the overlay
   paints and records one of three states on <html>:
   data-booted="1"      returning visitor in this session, no boot
   data-boot-skip="1"   deep link (?open=), saveData or reduced motion
   data-boot-play="1"   boot plays, and the session flag is written
   The overlay is only mounted for the / route by the (public) layout.
   Skipping at any moment (any key, click, tap, or the 44px Skip button)
   is handled by BootSkip. If JavaScript never loads, the CSS still fades
   the overlay out at 2.2s. The timeline is 2.2s on desktop and 1.4s on
   mobile via the media query overrides in os.css. */

import { headers } from "next/headers";
import { site } from "@/content/site";
import { BootSkip } from "./BootSkip";

/* Brief 2.3: the caption is the name and the headline, exact copy. */
const BOOT_WORD = "winnerOS";
const BOOT_SUB = `${site.name} · ${site.headline}`;

/* The only inline script. It must stay small and run before paint. */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("wos:booted")==="1"){d.setAttribute("data-booted","1");return}}catch(e){}var skip=false;try{skip=new URLSearchParams(location.search).has("open")}catch(e){}if(!skip&&navigator.connection&&navigator.connection.saveData){skip=true}if(!skip&&matchMedia("(prefers-reduced-motion: reduce)").matches){skip=true}if(skip){d.setAttribute("data-boot-skip","1");return}d.setAttribute("data-boot-play","1");try{sessionStorage.setItem("wos:booted","1")}catch(e){}})();`;

export async function Boot() {
  const h = await headers();
  const nonce = h.get("x-nonce") ?? undefined;
  return (
    <>
      <script nonce={nonce} dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      <div className="wos-boot" data-wos-boot>
        {/* The mark draws stroke by stroke. A dedicated SVG so both paths
            take pathLength 100 and the 2px teal boot stroke; the path data
            is the winnerOS mark from src/os/icons/Mark.tsx verbatim. */}
        <svg className="wos-boot-mark" viewBox="0 0 24 24" width={56} height={56} fill="none" aria-hidden="true">
          <path
            className="wos-boot-stroke wos-boot-stroke-shield"
            pathLength={100}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.5 C15 3.8 17.5 4.6 19.5 5 V10.2 C19.5 15.4 16.4 19.4 12 21.5 C7.6 19.4 4.5 15.4 4.5 10.2 V5 C6.5 4.6 9 3.8 12 2.5 Z"
          />
          <path
            className="wos-boot-stroke wos-boot-stroke-w"
            pathLength={100}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 9.5 L10 14.5 L12 11 L14 14.5 L16.5 9.5"
          />
        </svg>
        <div className="wos-boot-caption">
          <p className="wos-boot-word">{BOOT_WORD}</p>
          <p className="wos-boot-sub">{BOOT_SUB}</p>
          <span className="wos-boot-line" aria-hidden="true">
            <span className="wos-boot-line-fill" />
          </span>
        </div>
        <button type="button" className="wos-boot-skip wos-focusable" data-wos-boot-skip>
          Skip
        </button>
      </div>
      <BootSkip />
    </>
  );
}
