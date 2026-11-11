/* Files window content for the OS view of /work, fix 1 of the phase 1
   review: the work index lives inside a Files window instead of a full
   page behind the chrome. Everything comes from the typed content layer,
   nothing is invented. Case studies and labs carry data-wos-open, so the
   shell interception opens their document windows, fix 3. Archive items:
   AIX Market Analyzer and Motifi.AI keep their live demo links, Proof9 has
   no link of any kind and shows exactly its content line. */

import { work } from "@/content/work";

export function FilesWindowContent() {
  const cases = work.filter((item) => item.kind === "case-study");
  const labs = work.filter((item) => item.kind === "lab");
  const archive = work.filter((item) => item.kind === "archive");

  const group = (heading: string, items: typeof work) => (
    <section className="wos-filesgroup">
      <h3 className="wos-listhead">{heading}</h3>
      <ul className="wos-fileslist">
        {items.map((item) => (
          <li key={item.slug} className="wos-filesrow">
            <span className="wos-filesicon" aria-hidden>
              {item.kind === "archive" ? "◇" : "▸"}
            </span>
            {item.kind !== "archive" || item.link ? (
              <a
                href={item.kind === "archive" ? (item.link ?? undefined) : `/work/${item.slug}`}
                className="wos-fileslink"
                {...(item.kind === "archive" ? { target: "_blank", rel: "noreferrer" } : { "data-wos-open": `doc:${item.slug}` })}
              >
                {item.title}
              </a>
            ) : (
              <span className="wos-filesplain">{item.title}</span>
            )}
            <span className="wos-filesyear">{item.year}</span>
            {item.kind === "archive" ? <span className="wos-filesdesc">{item.card}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <div className="wos-filesview">
      <p className="wos-window-note">Projects, labs and archive from the content layer. Case studies and labs open their document windows.</p>
      {group("Case studies", cases)}
      {group("Labs", labs)}
      {group("Archive", archive)}
    </div>
  );
}
