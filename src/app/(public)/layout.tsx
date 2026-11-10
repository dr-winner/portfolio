import { headers } from "next/headers";
import { ClassicFrame } from "@/os/shell/ClassicFrame";
import { DesktopFrame } from "@/os/shell/DesktopFrame";
import { HashRedirect } from "@/components/site/HashRedirect";
import { classicHref } from "@/os/href";

/* Frame switch, brief 7.1. The middleware maps the ?view=classic param and
   the /classic path to an internal x-view request header, and this layout
   picks the frame server side, so both views ship complete server HTML.
   The desktop frame owns the OS chrome and will wrap route content in
   window shells; the classic frame keeps the document presentation. */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "/";
  if (h.get("x-view") === "classic") {
    return (
      <ClassicFrame>
        <HashRedirect />
        {children}
      </ClassicFrame>
    );
  }
  return (
    <DesktopFrame classicHref={classicHref(pathname)} boot={pathname === "/"}>
      <HashRedirect />
      {children}
    </DesktopFrame>
  );
}
