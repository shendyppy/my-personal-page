import { useState, useEffect } from "react";

export const useIsSmUp = () => {
  const [isSmUp, setIsSmUp] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsSmUp(window.innerWidth >= 640);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return isSmUp;
};
