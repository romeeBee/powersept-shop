import { useCallback, useEffect, useState } from "react";

const KEY = "signal.theme";

export function useTheme() {
  const [dark, setDark] = useState<boolean>(() =>
    typeof document === "undefined" ? false : document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(KEY, dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [dark]);

  const toggle = useCallback(() => setDark((value) => !value), []);
  return { dark, toggle };
}
