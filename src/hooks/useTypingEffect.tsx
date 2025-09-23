import { useState, useEffect } from "react";

const TypingText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div
      className="text-md md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto italic"
      dangerouslySetInnerHTML={{ __html: displayedText }}
    />
  );
};

export default TypingText;
