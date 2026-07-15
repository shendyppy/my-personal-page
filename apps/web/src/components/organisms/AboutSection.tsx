import Image from "next/image";
import { Download } from "lucide-react";

import { SITE_CONFIG } from "@/constants/config";
import type { AboutBundle } from "@/server/queries/about";

type AboutSectionProps = {
  initialData: AboutBundle;
};

const STATS = [
  { n: "4+", label: "YEARS SHIPPING" },
  { n: "10+", label: "PRODUCTS RELEASED" },
  { n: "3", label: "INDUSTRIES SERVED" },
];

/**
 * Editorial About — a rotated grayscale portrait that reveals a Download-CV
 * button on hover (pure CSS group-hover) beside a short-version bio and a
 * three-stat grid. Bio copy comes from the `AboutSection` DB rows.
 */
export const AboutSection = ({ initialData }: AboutSectionProps) => {
  const bio = initialData.aboutSections.find(
    (s) => s.key === "professional_bio"
  )?.content;
  const learning = initialData.aboutSections.find(
    (s) => s.key === "current_learning"
  )?.content;
  const cv = initialData.cvInfo;

  return (
    <section
      id="about"
      className="relative mx-auto box-border max-w-[1400px] px-6 py-36 md:px-10"
    >
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
        {/* Portrait + CV reveal */}
        <div className="relative">
          <div className="group relative -rotate-2 cursor-pointer overflow-hidden rounded-[20px]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={SITE_CONFIG.profileImage}
                alt={SITE_CONFIG.author}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover grayscale contrast-[1.05] transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
              />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,11,.9), rgba(10,10,11,.1) 55%, transparent)",
              }}
            />
            {cv && (
              <a
                href={cv.downloadPath}
                download={cv.downloadPath.split("/").pop()}
                className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 translate-y-[150%] -rotate-6 items-center gap-2.5 rounded-full bg-accent px-6 py-3.5 font-mono text-[13px] font-bold tracking-[0.05em] text-accent-foreground opacity-0 shadow-[0_14px_34px_rgba(0,0,0,0.45)] transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.5,1)] group-hover:translate-y-0 group-hover:rotate-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:rotate-0 [@media(hover:none)]:opacity-100"
              >
                <Download className="size-4" />
                DOWNLOAD CV
              </a>
            )}
          </div>
          <span className="absolute -right-2.5 -top-4 rotate-[4deg] rounded-full bg-accent px-3.5 py-2 font-mono text-[11px] font-bold tracking-[0.08em] text-accent-foreground">
            <span className="[@media(hover:none)]:hidden">HOVER FOR CV 👀</span>
            <span className="hidden [@media(hover:none)]:inline">TAP TO GET CV 👇</span>
          </span>
        </div>

        {/* Copy + stats */}
        <div>
          <p className="m-0 font-mono text-xs tracking-[0.14em] text-accent">
            ABOUT — THE SHORT VERSION
          </p>
          <h2 className="font-heading mt-5 text-[clamp(30px,3.4vw,48px)] font-bold leading-[1.15] tracking-[-0.02em]">
            Civil engineer turned software engineer — the pandemic plot twist
            that <span className="text-accent">actually worked out</span>.
          </h2>
          {bio && (
            <p className="mt-7 max-w-[560px] text-[17px] leading-[1.75] text-subtle">
              {bio}
            </p>
          )}
          {learning && (
            <p className="mt-4 max-w-[560px] text-[17px] leading-[1.75] text-subtle">
              {learning}
            </p>
          )}

          <div className="mt-11 grid grid-cols-3 overflow-hidden rounded-2xl border border-border">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`bg-card px-5 py-6 ${i > 0 ? "border-l border-border" : ""}`}
              >
                <div className="font-heading text-[38px] font-extrabold leading-none text-accent">
                  {s.n}
                </div>
                <div className="mt-2 font-mono text-[11px] tracking-[0.1em] text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
