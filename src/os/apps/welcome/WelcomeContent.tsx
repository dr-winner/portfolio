/* The Welcome app, brief 2.3 and fix 1 of the phase 1 review. Shared by the
   server rendered window shell on / and by DesktopShell when it reopens the
   window after a close. Copy is exact, from the review: no invented facts,
   no em dashes, no semicolons. Buttons stay real links so the window works
   without JavaScript. With the shell mounted the link interception, fix 3,
   opens the Files, Mail and Proxy windows in place from data-wos-open. */
import Link from "next/link";

import { PlatformHint } from "./PlatformHint";

const PROOF = [
  { value: "5", label: "OWASP LLM Top 10 attack paths tested" },
  { value: "6", label: "AWS detections mapped to MITRE ATT&CK" },
  { value: "2", label: "certifications earned, 2 in progress" },
];

export function WelcomeContent() {
  return (
    <div className="wos-welcome">
      <p className="wos-welcome-status">
        <span className="wos-welcome-dot" aria-hidden />
        Open to AppSec and product security roles
      </p>
      <h1 className="wos-welcome-name">Richard Winner Duvor</h1>
      <p className="wos-welcome-headline">
        <span className="wos-nowrap">Application Security Engineer</span>
        <span className="wos-pipe" aria-hidden>
          |
        </span>
        <span className="wos-nowrap">AI/LLM Security</span>
        <span className="wos-pipe" aria-hidden>
          |
        </span>
        <span className="wos-nowrap">Penetration Testing</span>
      </p>
      <p className="wos-welcome-intro">
        I test web applications and APIs for security flaws and write CVSS-scored findings that engineering teams can
        act on. A software engineering background lets me read an app from the inside before I test it from the
        outside.
      </p>
      <ul className="wos-welcome-proof">
        {PROOF.map((item) => (
          <li key={item.label}>
            <span className="wos-welcome-proofnum">{item.value}</span>
            <span className="wos-welcome-prooflabel">{item.label}</span>
          </li>
        ))}
      </ul>
      <div className="wos-welcome-actions">
        <Link href="/work" className="wos-btn wos-btn-primary" data-wos-open="files">
          Open Projects
        </Link>
        <a href="/cv.pdf" download className="wos-btn wos-btn-ghost">
          Download CV
        </a>
        <Link href="/contact" className="wos-btn wos-btn-ghost" data-wos-open="mail">
          Hire me
        </Link>
        <Link href="/work/llm-agent-security-lab" className="wos-btn wos-btn-ghost" data-wos-open="proxy">
          Try the Proxy
        </Link>
      </div>
      <p className="wos-welcome-hint">
        <PlatformHint /> Or open Terminal and type help.
      </p>
    </div>
  );
}
