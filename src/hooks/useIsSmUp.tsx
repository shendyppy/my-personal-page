import { useState, useEffect } from "react";

export const useIsSmUp = () => {
  const [isSmUp, setIsSmUp] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsSmUp(window.innerWidth >= 512);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return isSmUp;
};
