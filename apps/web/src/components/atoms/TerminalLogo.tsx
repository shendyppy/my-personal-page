import Link from "next/link";

interface TerminalLogoProps {
  /** Where the mark links to. Defaults to home. */
  href?: string;
  /** Extra classes for the wrapper anchor. */
  className?: string;
}

/**
 * The `~/shendy▮` terminal-prompt wordmark — the accent `~/`, the name, and a
 * blinking accent block cursor. Reused by the landing nav and the project
 * detail topbar so the brand mark is identical everywhere.
 */
export const TerminalLogo = ({ href = "/", className = "" }: TerminalLogoProps) => (
  <Link
    href={href}
    aria-label="Shendy — Home"
    className={`inline-flex items-center font-mono text-[15px] font-bold tracking-tight text-foreground transition-colors hover:text-foreground ${className}`}
  >
    <span className="text-accent">~/</span>
    shendy
    <span
      aria-hidden
      className="ml-1 inline-block h-4 w-2 bg-accent animate-blink"
    />
  </Link>
);
