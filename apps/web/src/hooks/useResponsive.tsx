import { useState, useEffect } from "react";

type UseMediaQueryProps = {
  min?: number; // minimum width in px
  max?: number; // maximum width in px
};

export const useMediaQuery = ({ min, max }: UseMediaQueryProps) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      const minMatch = min !== undefined ? width >= min : true;
      const maxMatch = max !== undefined ? width <= max : true;
      setMatches(minMatch && maxMatch);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, [min, max]);

  return matches;
};
