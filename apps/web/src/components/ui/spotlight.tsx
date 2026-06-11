import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  /** SVG fill — defaults to currentColor so the sweep can be tinted via a
   *  theme-aware text color on the wrapper (white-ish on dark, aurora on light). */
  fill?: string;
};

/**
 * Decorative light-sweep behind the hero (Aceternity spotlight). Pure SVG,
 * driven by the `animate-spotlight` keyframe in globals.css. fill is
 * currentColor by default so callers control the tint per theme.
 */
export const Spotlight = ({ className, fill }: SpotlightProps) => (
  <svg
    className={cn(
      "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
      className
    )}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 3787 2842"
    fill="none"
    aria-hidden
  >
    <g filter="url(#spotlight-blur)">
      <ellipse
        cx="1924.71"
        cy="273.501"
        rx="1924.71"
        ry="273.501"
        transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
        fill={fill ?? "currentColor"}
        fillOpacity="0.21"
      />
    </g>
    <defs>
      <filter
        id="spotlight-blur"
        x="0.860352"
        y="0.838989"
        width="3785.16"
        height="2840.26"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8" />
      </filter>
    </defs>
  </svg>
);
