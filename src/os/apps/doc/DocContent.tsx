/* Document window content for windows the shell opens itself, brief 3.11
   deep links and fix 3 link interception. The server rendered route wraps
   the full article, this client version renders the real case study text
   from the content layer in a lighter reading layout, and the full
   document stays one link away in the classic view. Everything shown
   comes from work data, nothing is invented. */

import Link from "next/link";
import { work } from "@/content/work";
import { ReadmeContent } from "./ReadmeContent";

export function DocContent({ slug }: { slug?: string }) {
  if (!slug || slug === "readme") return <ReadmeContent />;
  const item = work.find((entry) => entry.slug === slug);
  if (!item) {
    return (
      <div className="wos-docview">
        <p className="wos-window-note">This document id is not in the content layer.</p>
        <p className="wos-window-actions">
          <Link href="/work?view=classic" className="wos-btn wos-btn-ghost">
            Open the project index in the classic view
          </Link>
        </p>
      </div>
    );
  }
  return (
    <div className="wos-docview">
      <p className="wos-window-note">
        {[item.context, ...(item.badges ?? [])].filter(Boolean).join(" · ")}
      </p>
      <h3 className="wos-listhead">{item.title}</h3>
      <p className="wos-docpara">{item.description}</p>
      {item.outcome ? (
        <>
          <h3 className="wos-listhead">Outcome</h3>
          <p className="wos-docpara">{item.outcome}</p>
        </>
      ) : null}
      {item.scope ? (
        <>
          <h3 className="wos-listhead">Scope</h3>
          <p className="wos-docpara">{item.scope}</p>
        </>
      ) : null}
      {item.sections.map((section) => (
        <section key={section.id}>
          <h3 className="wos-listhead">{section.heading}</h3>
          {section.paragraphs.map((paragraph, index) => (
            <p key={index} className="wos-docpara">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
      <p className="wos-window-actions">
        <Link href={`/work/${item.slug}?view=classic`} className="wos-btn wos-btn-ghost">
          Open the full document in the classic view
        </Link>
      </p>
    </div>
  );
}
