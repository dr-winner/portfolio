/* Shared winnerOS types. Kept tiny and dependency free so both server
   frames and the client shell can import the module. */

/** One id per app in the OS, brief heading 6.7 (13 tiles). */
export type AppId =
  | "welcome"
  | "files"
  | "doc"
  | "terminal"
  | "proxy"
  | "agent-lab"
  | "findings"
  | "detections"
  | "about"
  | "mail"
  | "preview"
  | "settings"
  | "security";
