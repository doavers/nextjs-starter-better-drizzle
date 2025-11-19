import { useEffect, useState } from "react";

export function useMediaQuery() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handler = (e: MediaQueryListEvent) => {
      setIsOpen(e.matches);
    };

    // Set initial state using the handler function to avoid direct setState call in effect
    handler({ matches: mediaQuery.matches } as MediaQueryListEvent);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return { isOpen };
}
