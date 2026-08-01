"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (localStorage.getItem("theme") as Theme | null) ?? "system";
    setTheme(stored);
    applyTheme(stored);
  }, []);

  function applyTheme(next: Theme) {
    const root = document.documentElement;
    if (next === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", next);
    }
  }

  function cycle() {
    const next: Theme =
      theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className="mono"
        style={{
          border: "1px solid var(--line)",
          background: "transparent",
          padding: "6px 12px",
          borderRadius: "999px",
          fontSize: "11px",
          letterSpacing: "0.06em",
          color: "var(--ink-2)",
          minWidth: "76px",
        }}
        aria-label="Theme (loading)"
      >
        THEME
      </button>
    );
  }

  const label = theme === "system" ? "AUTO" : theme.toUpperCase();

  return (
    <button
      type="button"
      onClick={cycle}
      className="mono"
      style={{
        border: "1px solid var(--line)",
        background: "transparent",
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "11px",
        letterSpacing: "0.06em",
        color: "var(--ink-2)",
        cursor: "pointer",
        minWidth: "76px",
      }}
      aria-label={`Theme: ${label}. Click to change.`}
    >
      {label}
    </button>
  );
}
