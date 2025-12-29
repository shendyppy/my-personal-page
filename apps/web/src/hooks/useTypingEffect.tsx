import { useState, useEffect, useMemo } from "react";

const parseSimpleHTML = (
  html: string
): { text: string; boldRanges: [number, number][] } => {
  let plainText = "";
  const boldRanges: [number, number][] = [];
  let currentPos = 0;
  let inBold = false;
  let boldStart = 0;

  const stripped = html.replace(/<p>/g, "").replace(/<\/p>/g, "");
  let i = 0;

  while (i < stripped.length) {
    if (stripped.slice(i, i + 3) === "<b>") {
      inBold = true;
      boldStart = currentPos;
      i += 3;
    } else if (stripped.slice(i, i + 4) === "</b>") {
      if (inBold) {
        boldRanges.push([boldStart, currentPos]);
        inBold = false;
      }
      i += 4;
    } else {
      plainText += stripped[i];
      currentPos++;
      i++;
    }
  }

  return { text: plainText, boldRanges };
};

const TypingText = ({ text }: { text: string }) => {
  const [displayedLength, setDisplayedLength] = useState(0);

  const { text: plainText, boldRanges } = useMemo(() => parseSimpleHTML(text), [text]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedLength(i + 1);
      i++;
      if (i === plainText.length) {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [plainText]);

  const renderText = () => {
    const displayedText = plainText.slice(0, displayedLength);
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    boldRanges.forEach(([start, end], idx) => {
      // Only include bold ranges that are visible
      if (start < displayedLength) {
        // Add text before bold
        if (start > lastIndex) {
          segments.push(
            <span key={`text-${idx}`}>{displayedText.slice(lastIndex, start)}</span>
          );
        }

        // Add bold text (only the visible part)
        const boldEnd = Math.min(end, displayedLength);
        segments.push(
          <strong key={`bold-${idx}`}>{displayedText.slice(start, boldEnd)}</strong>
        );

        lastIndex = boldEnd;
      }
    });

    // Add remaining text
    if (lastIndex < displayedLength) {
      segments.push(
        <span key="text-last">{displayedText.slice(lastIndex)}</span>
      );
    }

    return segments;
  };

  return (
    <div className="text-md md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto italic">
      {renderText()}
    </div>
  );
};

export default TypingText;
