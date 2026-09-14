"use client";

import { useId, useState } from "react";

import { SonarReadout, type ToolGroup } from "@/components/molecules/SonarReadout";
import { blipPosition } from "@/lib/dive/sonar";

const SIZE = 640;
const C = SIZE / 2;
const R = 290;
const RINGS = [70, 110, 150, 190, 230, 270];
const WEDGE = Math.PI / 5;

type SonarChartProps = { groups: ToolGroup[] };

/** SVG sonar: rings, crosshair, sweeping wedge, one blip per category → readout. */
export const SonarChart = ({ groups }: SonarChartProps) => {
  const [active, setActive] = useState<ToolGroup | null>(null);
  const gradId = useId();

  return (
    <div className="sonar" data-reveal>
      <div className="sonar-scope">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="sonar-svg" role="img" aria-label="Toolbox categories as sonar contacts">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--hud)" stopOpacity="0" />
              <stop offset="1" stopColor="var(--hud)" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          {RINGS.map((r) => (
            <circle key={r} cx={C} cy={C} r={r} className="sonar-ring" data-ring />
          ))}
          <line x1={C} y1={C - R} x2={C} y2={C + R} className="sonar-ring" />
          <line x1={C - R} y1={C} x2={C + R} y2={C} className="sonar-ring" />
          <g className="sonar-sweep" style={{ transformOrigin: `${C}px ${C}px` }}>
            <path
              d={`M${C},${C} L${C + R},${C} A${R},${R} 0 0,1 ${C + R * Math.cos(WEDGE)},${C + R * Math.sin(WEDGE)} Z`}
              fill={`url(#${gradId})`}
            />
          </g>
        </svg>

        {/* Own ship, parked in the scope's empty top-right corner (see globals.css). */}
        <div data-sub-anchor="lane" aria-hidden className="sonar-lane" />

        <ul className="sonar-blips">
          {groups.map((g, i) => {
            // Ring follows category order, so the stack reads inside-out.
            const { x, y } = blipPosition(i, groups.length, RINGS[Math.min(i, RINGS.length - 1)], C, C);
            const isActive = active?.category === g.category;
            // Label on the outer side of the dot, away from the centre: above
            // or below on the vertical axis, else beside. Labels stacked under
            // every dot collided on the inner rings.
            const side = Math.abs(x - C) < 1 ? (y < C ? "top" : "bottom") : x < C ? "left" : "right";
            return (
              <li key={g.category} style={{ left: `${(x / SIZE) * 100}%`, top: `${(y / SIZE) * 100}%` }}>
                <button
                  type="button"
                  className={`blip blip--${side} ${isActive ? "is-active" : ""}`}
                  aria-pressed={isActive}
                  onMouseEnter={() => setActive(g)}
                  onFocus={() => setActive(g)}
                  // Select, never toggle: a tap focuses (and mouseenters) the
                  // button before its click, so a toggle cleared what the tap
                  // had just selected.
                  onClick={() => setActive(g)}
                >
                  <span className="blip-dot" />
                  <span className="blip-label">{g.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <SonarReadout group={active} />
    </div>
  );
};
