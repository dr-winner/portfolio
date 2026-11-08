export function OgCard({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string;
  title: string;
  detail: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        backgroundColor: "#07090C",
        backgroundImage:
          "radial-gradient(circle at 80% 20%, rgba(94,234,212,0.18), transparent 36%), radial-gradient(circle, rgba(232,237,242,0.16) 1px, transparent 1px)",
        backgroundSize: "auto, 22px 22px",
        color: "#E8EDF2",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 72,
          top: 72,
          width: 280,
          height: 220,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          opacity: 0.45,
        }}
      >
        {Array.from({ length: 48 }).map((_, index) => (
          <div key={index} style={{ width: 3, height: 3, borderRadius: 99, background: "#D5E4EA" }} />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#5EEAD4" }}>
        <div style={{ width: 12, height: 12, borderRadius: 999, background: "#5EEAD4" }} />
        <div style={{ fontSize: 28, letterSpacing: 0 }}>{eyebrow}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 980 }}>
        <div style={{ fontSize: 68, fontWeight: 650, lineHeight: 1.02, letterSpacing: -2 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#9BA8B5", lineHeight: 1.3 }}>{detail}</div>
      </div>
      <div style={{ display: "flex", gap: 16, color: "#738091", fontSize: 22 }}>
        <div>duvorrichardwinner.me</div>
        <div>·</div>
        <div>Accra, Ghana</div>
      </div>
    </div>
  );
}
