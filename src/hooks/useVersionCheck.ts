import { useCallback, useEffect, useRef, useState } from "react";

// The version baked into this bundle at build time (see vite.config.ts).
const CURRENT_VERSION = __BUILD_VERSION__;

// How often to check for a newer deployment while the tab is open.
const POLL_INTERVAL_MS = 60_000;

/**
 * Polls the statically-served `/version.json` and reports whether a newer
 * front-end has been deployed since this tab was loaded.
 *
 * A check runs on mount, on the given interval, and whenever the tab regains
 * focus (so a user coming back to an old tab is told promptly). Failures
 * (offline, dev server without the file, etc.) are swallowed.
 */
export function useVersionCheck(pollIntervalMs: number = POLL_INTERVAL_MS) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  // Once an update is detected we stop polling — the flag only latches on.
  const detectedRef = useRef(false);

  const checkVersion = useCallback(async () => {
    if (detectedRef.current) return;
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data: { version?: string } = await res.json();
      if (data.version && data.version !== CURRENT_VERSION) {
        detectedRef.current = true;
        setUpdateAvailable(true);
      }
    } catch {
      // Network error / missing file (e.g. dev) — ignore and retry later.
    }
  }, []);

  useEffect(() => {
    checkVersion();

    const interval = window.setInterval(checkVersion, pollIntervalMs);
    const onVisibility = () => {
      if (document.visibilityState === "visible") checkVersion();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [checkVersion, pollIntervalMs]);

  return updateAvailable;
}
