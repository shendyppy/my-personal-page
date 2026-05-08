import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/constants/config";

export const runtime = "edge";
export const alt = `${SITE_CONFIG.author} — Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "28px",
            color: "#a5b4fc",
            marginBottom: "16px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "linear-gradient(90deg, #6366f1, #f472b6)",
            }}
          />
          shendyppy.vercel.app
        </div>

        <div
          style={{
            fontSize: "96px",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            background:
              "linear-gradient(90deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "24px",
          }}
        >
          {SITE_CONFIG.author}
        </div>

        <div
          style={{
            fontSize: "44px",
            color: "#e2e8f0",
            fontWeight: 500,
            marginBottom: "40px",
          }}
        >
          Software Engineer · Front-End · Full-Stack
        </div>

        <div
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            display: "flex",
            gap: "32px",
            alignItems: "center",
          }}
        >
          <span>React</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>Next.js</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>TypeScript</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>Three.js</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>Prisma</span>
        </div>
      </div>
    ),
    size
  );
}
