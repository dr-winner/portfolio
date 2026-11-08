"use client";

import { useEffect, useState } from "react";

export function RequestedPath() {
  const [path, setPath] = useState("/");

  useEffect(() => {
    setPath(window.location.pathname.slice(0, 80) || "/");
  }, []);

  return <span>{path}</span>;
}
