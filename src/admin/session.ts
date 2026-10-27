import { useCallback, useEffect, useState } from "react";

/**
 * Browser-side gate for the editor. It keeps the admin UI out of the way of
 * readers; it is not authentication. Anything that needs real access control
 * has to be enforced by a server.
 */
const SESSION_KEY = "signal.admin.session";
const PASS_KEY = "signal.admin.pass";
const DEFAULT_PASS = "signal";

export function adminPassphrase(): string {
  try {
    return localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
  } catch {
    return DEFAULT_PASS;
  }
}

export function setAdminPassphrase(value: string) {
  localStorage.setItem(PASS_KEY, value);
}

export function useAdminSession() {
  const [signedIn, setSignedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (signedIn) sessionStorage.setItem(SESSION_KEY, "1");
      else sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, [signedIn]);

  const signIn = useCallback((passphrase: string) => {
    const ok = passphrase === adminPassphrase();
    if (ok) setSignedIn(true);
    return ok;
  }, []);

  const signOut = useCallback(() => setSignedIn(false), []);

  return { signedIn, signIn, signOut };
}
