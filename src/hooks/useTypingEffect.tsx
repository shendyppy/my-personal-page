import { useState, useEffect } from "react";

const TypingText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="text-md md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto italic underline">
      {displayedText}
      <span className="animate-pulse">|</span>
    </p>
  );
};

export default TypingText;
