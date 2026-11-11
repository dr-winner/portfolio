/* Mail window content for the OS view of /contact, fix 1 of the phase 1
   review. Real contact paths from the content layer, the address visible
   exactly once, and the full contact page stays reachable in the classic
   view. The CopyEmail control is the existing client component. */

import { CopyEmail } from "@/components/site/CopyEmail";
import { mailto, site } from "@/content/site";

const SOCIALS = [
  { label: "GitHub", href: site.links.github },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "X", href: site.links.x },
];

export function MailWindowContent() {
  return (
    <div className="wos-mailview">
      <p className="wos-window-note">{site.availability}</p>
      <section className="wos-filesgroup">
        <h3 className="wos-listhead">Email</h3>
        <p className="wos-mailrow">
          <a href={mailto} className="wos-fileslink">
            {site.email}
          </a>
          <CopyEmail variant="icon" />
        </p>
      </section>
      <section className="wos-filesgroup">
        <h3 className="wos-listhead">Elsewhere</h3>
        <ul className="wos-aboutlist">
          {SOCIALS.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer" className="wos-fileslink">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <p className="wos-window-actions">
        <a href="/contact?view=classic" className="wos-btn wos-btn-ghost">
          Open the full contact page
        </a>
      </p>
    </div>
  );
}
