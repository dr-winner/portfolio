/* About window content for the OS view of /about, fix 1 of the phase 1
   review: the route content sits inside an About window instead of a full
   page under the chrome. Facts come straight from the content layer, the
   heading levels start at h3 (the window title is the page heading), and
   the full document stays reachable in the classic view. */

import { experience } from "@/content/experience";
import { certifications } from "@/content/certifications";
import { site } from "@/content/site";
import { skills } from "@/content/skills";

export function AboutWindowContent() {
  const security = experience.filter((entry) => entry.group === "security");
  const earned = certifications.filter((cert) => cert.status === "earned");
  const progress = certifications.filter((cert) => cert.status === "in-progress");
  const focus = skills.slice(0, 2);
  return (
    <div className="wos-aboutview">
      <p className="wos-window-note">
        {site.availabilityShort} The full document version lives in the classic view.
      </p>
      <section className="wos-filesgroup">
        <h3 className="wos-listhead">Focus</h3>
        {focus.map((group) => (
          <div key={group.title} className="wos-aboutgroup">
            <p className="wos-abouttitle">{group.title}</p>
            <p className="wos-aboutmeta">{group.items}</p>
          </div>
        ))}
      </section>
      <section className="wos-filesgroup">
        <h3 className="wos-listhead">Security experience</h3>
        <ul className="wos-aboutlist">
          {security.map((entry) => (
            <li key={entry.title}>
              <span className="wos-abouttitle">{entry.title}</span>
              <span className="wos-aboutmeta">
                {entry.org} · {entry.period}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className="wos-filesgroup">
        <h3 className="wos-listhead">Certifications</h3>
        <ul className="wos-aboutlist">
          {earned.map((cert) => (
            <li key={cert.name}>
              <span className="wos-abouttitle">{cert.name}</span>
              <span className="wos-aboutmeta">Earned {cert.year}</span>
            </li>
          ))}
          {progress.map((cert) => (
            <li key={cert.name}>
              <span className="wos-abouttitle">{cert.name}</span>
              <span className="wos-aboutmeta">In progress</span>
            </li>
          ))}
        </ul>
      </section>
      <p className="wos-window-actions">
        <a href="/about?view=classic" className="wos-btn wos-btn-ghost">
          Open the full about page
        </a>
      </p>
    </div>
  );
}
