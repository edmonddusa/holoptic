import { useEffect, useId, useState } from "react";

// The Holoptic Algiz emblem, drawn inline so its parts can be animated.
// Same geometry as public/images/holoptic-algiz.svg.

const polar = (r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
};

// 60 dial ticks; every fifth one is long.
const TICKS = Array.from({ length: 60 }, (_, i) => {
  const major = i % 5 === 0;
  const [x1, y1] = polar(major ? 86 : 88, i * 6);
  const [x2, y2] = polar(major ? 92 : 90, i * 6);
  return {
    major,
    d: `M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`,
  };
});

// Circuit traces, each running from an outer node in towards the rune.
const TRACES = [
  ["M39 113H70L77 125V150", [39, 113], [77, 150]],
  ["M43 127H67L77 139V158", [43, 127], [77, 158]],
  ["M47 141H64L77 153V166", [47, 141], [77, 166]],
  ["M161 113H130L123 125V150", [161, 113], [123, 150]],
  ["M157 127H133L123 139V158", [157, 127], [123, 158]],
  ["M153 141H136L123 153V166", [153, 141], [123, 166]],
];

// The rune: the stem (bottom to top), then the two branches.
const RUNE = ["M100 173V22", "M100 101L59 61", "M100 101L141 61"];
const RUNE_HIGHLIGHT = ["M100 171V25", "M100 101L61 63", "M100 101L139 63"];
const MARKS = ["M183 100H198", "M100 183V198", "M17 100H2", "M100 17V2"];

const INTRO_KEY = "holoptic-emblem-drawn";

// Draw the emblem on the first page of a visit only.
function shouldDraw() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  try {
    return !sessionStorage.getItem(INTRO_KEY);
  } catch {
    return false;
  }
}

export default function Emblem({ className = "", intro = false }) {
  const id = useId().replace(/:/g, "");
  const metal = `em-metal-${id}`;
  const runeMetal = `em-rune-${id}`;
  const shineMask = `em-shine-mask-${id}`;
  const shineBand = `em-shine-band-${id}`;
  const [drawing] = useState(() => intro && shouldDraw());
  useEffect(() => {
    if (!drawing) return;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // Storage unavailable: the intro simply plays again next time.
    }
  }, [drawing]);

  return (
    <svg
      viewBox="0 0 200 200"
      className={`emblem ${className}${drawing ? " is-drawing" : ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={metal}
          gradientUnits="userSpaceOnUse"
          x1="13"
          y1="13"
          x2="187"
          y2="187"
        >
          <stop stopColor="#F6D68F" />
          <stop offset=".48" stopColor="#C9A46B" />
          <stop offset="1" stopColor="#A57939" />
        </linearGradient>
        <linearGradient
          id={runeMetal}
          gradientUnits="userSpaceOnUse"
          x1="59"
          y1="22"
          x2="141"
          y2="173"
        >
          <stop stopColor="#F6D68F" />
          <stop offset=".48" stopColor="#C9A46B" />
          <stop offset="1" stopColor="#A57939" />
        </linearGradient>
        <linearGradient id={shineBand}>
          <stop offset="0" stopColor="#000" />
          <stop offset=".5" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask
          id={shineMask}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="200"
          height="200"
        >
          <g transform="rotate(25 100 100)">
            <rect
              className="em-shine-band"
              x="-90"
              y="-60"
              width="70"
              height="320"
              fill={`url(#${shineBand})`}
            />
          </g>
        </mask>
      </defs>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className="em-dial">
          <circle
            cx="100"
            cy="100"
            r="91"
            stroke={`url(#${metal})`}
            strokeWidth="1.4"
            pathLength="1"
          />
          {TICKS.map((tick, i) => (
            <path
              key={tick.d}
              className="em-tick"
              d={tick.d}
              stroke="#C9A46B"
              strokeWidth={tick.major ? 1.6 : 0.65}
              opacity={tick.major ? 0.95 : 0.65}
              style={{ "--i": i }}
            />
          ))}
        </g>
        <g className="em-rings">
          <circle
            cx="100"
            cy="100"
            r="83"
            stroke={`url(#${metal})`}
            strokeWidth="3.8"
            pathLength="1"
          />
          <circle
            cx="100"
            cy="100"
            r="74"
            stroke="#C9A46B"
            strokeWidth=".7"
            opacity=".8"
            pathLength="1"
          />
          <circle
            cx="100"
            cy="100"
            r="58"
            stroke="#C9A46B"
            strokeWidth=".7"
            opacity=".4"
            pathLength="1"
          />
          <circle
            cx="100"
            cy="100"
            r="46"
            stroke="#C9A46B"
            strokeWidth=".5"
            opacity=".24"
            pathLength="1"
          />
        </g>
        <g className="em-circuits">
          {TRACES.map(([d, outer, inner], i) => (
            <g key={d} style={{ "--i": i % 3 }}>
              <path d={d} stroke="#C9A46B" strokeWidth="1.6" pathLength="1" />
              <circle
                className="em-node em-node-outer"
                cx={outer[0]}
                cy={outer[1]}
                r="2.8"
                stroke="#F2C778"
                strokeWidth="1.4"
              />
              <circle
                className="em-node"
                cx={inner[0]}
                cy={inner[1]}
                r="2.2"
                stroke="#C9A46B"
                strokeWidth="1.2"
              />
            </g>
          ))}
        </g>
        <g className="em-rune">
          {RUNE.map((d, i) => (
            <path
              key={d}
              d={d}
              stroke={`url(#${runeMetal})`}
              strokeWidth="10"
              pathLength="1"
              style={{ "--i": i }}
            />
          ))}
          {RUNE_HIGHLIGHT.map((d, i) => (
            <path
              key={d}
              d={d}
              stroke="#F7D991"
              strokeWidth="1.1"
              opacity=".65"
              pathLength="1"
              style={{ "--i": i }}
            />
          ))}
        </g>
        <g className="em-pulses">
          {TRACES.map(([d], i) => (
            <path key={d} d={d} pathLength="1" style={{ "--i": i % 3 }} />
          ))}
          <path className="em-pulse-stem" d="M100 173V22" pathLength="1" />
        </g>
        <g className="em-shine" mask={`url(#${shineMask})`} stroke="#FFF9EA">
          <circle cx="100" cy="100" r="91" strokeWidth="1.4" />
          <circle cx="100" cy="100" r="83" strokeWidth="3.8" />
          {RUNE.map((d) => (
            <path key={d} d={d} strokeWidth="10" />
          ))}
        </g>
        <g className="em-marks">
          {MARKS.map((d) => (
            <path key={d} d={d} stroke="#F2C778" strokeWidth="2.2" />
          ))}
        </g>
      </g>
    </svg>
  );
}
