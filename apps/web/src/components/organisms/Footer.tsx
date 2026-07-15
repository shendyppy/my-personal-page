import { Github, Instagram, Linkedin, Mail, Twitter } from "lucide-react";

import { BackToTop } from "@/components/atoms/BackToTop";
import { AvailabilityStatus } from "@/components/molecules/AvailabilityStatus";
import { MagneticEmailButton } from "@/components/molecules/MagneticEmailButton";
import { EXTERNAL_LINKS, SITE_CONFIG } from "@/constants/config";

const SOCIALS = [
  { href: EXTERNAL_LINKS.github, label: "GitHub", Icon: Github },
  { href: EXTERNAL_LINKS.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: EXTERNAL_LINKS.instagram, label: "Instagram", Icon: Instagram },
  { href: EXTERNAL_LINKS.twitter, label: "Twitter", Icon: Twitter },
  { href: `mailto:${EXTERNAL_LINKS.email}`, label: "Email", Icon: Mail },
];

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border/60">
      <div className="mx-auto box-border max-w-[1400px] px-6 pb-10 pt-28 text-center md:px-10">
        <AvailabilityStatus />

        <p className="mt-5 font-mono text-xs tracking-[0.14em] text-muted-foreground">
          OPEN TO SENIOR FRONT-END · FULL-STACK · BA &amp; LEAD ROLES
        </p>

        <h2 className="font-heading mx-auto mt-5 max-w-[15ch] text-[clamp(32px,5.6vw,88px)] font-extrabold uppercase leading-[0.98] tracking-[-0.03em]">
          Let&apos;s build
          <br />
          something good
          <span className="text-accent">.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-[440px] text-base leading-relaxed text-subtle">
          A product to ship, a team to lead, or a wild experiment in mind? The
          fastest way to reach me is a quick email.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <MagneticEmailButton email={EXTERNAL_LINKS.email} />
          <a
            href={EXTERNAL_LINKS.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-4 font-mono text-xs tracking-[0.04em] text-subtle transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            BOOK A CALL
          </a>
        </div>

        <div className="mt-14 flex justify-center gap-3.5">
          {SOCIALS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex size-[52px] items-center justify-center rounded-full border border-border text-subtle transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 items-center gap-4 border-t border-border/60 pt-6 font-mono text-[11px] tracking-[0.1em] text-muted-foreground md:grid-cols-3">
          <span className="md:justify-self-start">
            © {year} {SITE_CONFIG.author.toUpperCase()}
          </span>
          <span className="text-center md:justify-self-center">
            DESIGNED &amp; BUILT WITH CURIOSITY IN TANGERANG SELATAN
          </span>
          <BackToTop className="md:justify-self-end" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
