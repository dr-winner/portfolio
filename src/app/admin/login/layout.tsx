import "../../globals.css";

export const metadata = { title: "Sign in · Admin", robots: { index: false, follow: false } };

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-sans antialiased">{children}</div>;
}
