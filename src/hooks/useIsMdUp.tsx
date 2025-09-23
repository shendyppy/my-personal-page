import { useState, useEffect } from "react";

export const useIsMdUp = () => {
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMdUp(window.innerWidth >= 768); // Tailwind "md"
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return isMdUp;
};
