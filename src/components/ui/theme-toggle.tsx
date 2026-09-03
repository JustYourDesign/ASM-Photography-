"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

function subscribeNoop() {
  return () => {};
}

/** True only after the client has hydrated — avoids a server/client theme mismatch. */
function useHasMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      data-cursor="hidden"
      className={className}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <Sun
          className={`absolute h-4 w-4 transition-all duration-300 ${
            mounted && !isDark ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
          strokeWidth={1.5}
        />
        <Moon
          className={`absolute h-4 w-4 transition-all duration-300 ${
            mounted && isDark ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
          strokeWidth={1.5}
        />
      </span>
    </button>
  );
}
