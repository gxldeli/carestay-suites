/* Hand-drawn line illustrations for the avatar landing pages.
   One stroke style everywhere: 1.8px, round caps, ink line + a soft tint fill.
   Colours come from CSS variables so each page can re-tint them. */

import type { ReactNode } from "react";

const T = "var(--ill-tint)"; // soft fill behind the line work
const A = "var(--ill-accent)"; // small accent details
const W = "var(--ill-warm)"; // warm highlight (flame, light, gold)

const ICONS: Record<string, ReactNode> = {
  sleep: (<>
    <circle cx="35" cy="13" r="8" fill={T} stroke="none" />
    <path d="M36.5 7.5a6.5 6.5 0 1 0 5.8 9.6 5.4 5.4 0 0 1-5.8-9.6z" />
    <path d="M6 38V20M6 31h36v7M42 31v-5a4 4 0 0 0-4-4H21v9" />
    <rect x="9" y="24" width="9" height="5" rx="2.5" />
  </>),
  mask: (<>
    <path d="M6 21c7-7 29-7 36 0v5c-7 7-29 7-36 0z" fill={T} />
    <path d="M13 24c2 2 6 2 8 0M27 24c2 2 6 2 8 0" />
    <path d="M6 23H3M42 23h3" />
  </>),
  plug: (<>
    <rect x="11" y="7" width="26" height="34" rx="6" fill={T} />
    <rect x="17" y="12" width="14" height="10" rx="4" />
    <rect x="17" y="26" width="14" height="10" rx="4" />
    <path d="M21.5 15.5v3M26.5 15.5v3M21.5 29.5v3M26.5 29.5v3" />
  </>),
  cutlery: (<>
    <circle cx="24" cy="24" r="17" fill={T} stroke="none" />
    <path d="M15 7v9a4 4 0 0 0 8 0V7M19 7v9M19 20v21" />
    <path d="M32 41V7c4 3 6 9 6 16h-6" />
  </>),
  coffee: (<>
    <path d="M10 19h22v13a8 8 0 0 1-8 8h-6a8 8 0 0 1-8-8z" fill={T} />
    <path d="M32 23h3a5 5 0 0 1 0 10h-3" />
    <path d="M16 7c-2 3 2 5 0 8M22 7c-2 3 2 5 0 8M28 7c-2 3 2 5 0 8" />
  </>),
  shower: (<>
    <path d="M11 42V14a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8v2" />
    <path d="M22 18a8 8 0 0 1 14 0z" fill={T} />
    <path d="M24 24l-1.5 3.5M29 24v3.5M34 24l1.5 3.5M26 31l-1.5 3.5M32 31l1.5 3.5" stroke={A} />
  </>),
  desk: (<>
    <rect x="9" y="7" width="30" height="20" rx="2.5" fill={T} />
    <path d="M24 27v6M18 33h12M4 39h40M8 39v4M40 39v4" />
  </>),
  wifi: (<>
    <circle cx="24" cy="36" r="8" fill={T} stroke="none" />
    <path d="M7 19a25 25 0 0 1 34 0M12.5 25a17 17 0 0 1 23 0M18 31a9 9 0 0 1 12 0" />
    <circle cx="24" cy="36.5" r="2" fill="currentColor" />
  </>),
  washer: (<>
    <rect x="9" y="6" width="30" height="36" rx="4" />
    <path d="M9 14h30" />
    <circle cx="15" cy="10" r="1.2" fill="currentColor" /><circle cx="20" cy="10" r="1.2" fill="currentColor" />
    <circle cx="24" cy="28" r="9" fill={T} />
    <path d="M18 29c2-2 4 2 6 0s4 2 6 0" stroke={A} />
  </>),
  bin: (<>
    <path d="M7 12h34v6H7z" fill={T} />
    <path d="M9 18h30v20a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3zM20 25h8" />
    <path d="M33 26l5 5" stroke={A} /><rect x="35" y="29" width="7" height="5" rx="1" transform="rotate(45 38.5 31.5)" stroke={A} />
  </>),
  receipt: (<>
    <path d="M12 6h24v36l-4-3-4 3-4-3-4 3-4-3-4 3z" fill={T} />
    <path d="M18 15h12M18 21h12M18 27h7" />
    <path d="M27 31l2.5 2.5L34 29" stroke={A} />
  </>),
  key: (<>
    <circle cx="16" cy="24" r="9" fill={T} />
    <circle cx="16" cy="24" r="3" />
    <path d="M25 24h17M36 24v6M41 24v4" />
  </>),
  calendar: (<>
    <rect x="7" y="10" width="34" height="31" rx="4" />
    <path d="M7 18h34M16 6v8M32 6v8" />
    <rect x="11" y="22" width="5" height="5" rx="1.2" fill={A} stroke="none" />
    <rect x="18" y="22" width="5" height="5" rx="1.2" fill={A} stroke="none" />
    <rect x="25" y="22" width="5" height="5" rx="1.2" fill={A} stroke="none" />
    <rect x="32" y="22" width="5" height="5" rx="1.2" fill={A} stroke="none" />
    <rect x="11" y="31" width="5" height="5" rx="1.2" fill={T} stroke="none" />
    <rect x="18" y="31" width="5" height="5" rx="1.2" fill={T} stroke="none" />
    <rect x="25" y="31" width="5" height="5" rx="1.2" fill={T} stroke="none" />
    <rect x="32" y="31" width="5" height="5" rx="1.2" fill={T} stroke="none" />
  </>),
  parking: (<>
    <rect x="10" y="6" width="28" height="28" rx="7" fill={T} />
    <path d="M20 29V13h6a5 5 0 0 1 0 10h-6M24 34v9" />
  </>),
  fireplace: (<>
    <path d="M5 11h38M8 11v31M40 11v31M5 42h38" />
    <path d="M14 42V19h20v23" />
    <path d="M24 39c-4 0-6-3-5-6 1-2 3-3 3-6 3 2 7 5 7 8.5 0 2-2 3.5-5 3.5z" fill={W} stroke={W} />
  </>),
  tub: (<>
    <path d="M8 22h32v5a11 11 0 0 1-11 11H19A11 11 0 0 1 8 27z" fill={T} />
    <path d="M5 22h38M14 37l-2 5M34 37l2 5M12 22V12a4 4 0 0 1 8 0v1" />
    <circle cx="26" cy="16" r="2" stroke={A} /><circle cx="32" cy="12" r="2.6" stroke={A} /><circle cx="36" cy="18" r="1.6" stroke={A} />
  </>),
  garden: (<>
    <path d="M14 30h20l-3 12H17z" fill={T} />
    <path d="M24 30V14M24 22c-6 0-10-4-10-10 6 0 10 4 10 10zM24 18c5 0 9-3 9-9-5 0-9 3-9 9z" />
  </>),
  tv: (<>
    <rect x="5" y="9" width="38" height="25" rx="3" fill={T} />
    <path d="M16 41h16M24 34v7" />
    <path d="M21 16v11l9-5.5z" fill={A} stroke={A} />
  </>),
  bubbly: (<>
    <path d="M12 9h9l-1 11a3.5 3.5 0 0 1-7 0z" fill={T} transform="rotate(-10 16 20)" />
    <path d="M27 9h9l-1 11a3.5 3.5 0 0 1-7 0z" fill={T} transform="rotate(10 31 20)" />
    <path d="M17.5 24l-1.5 13M13 37h7M30.5 24l1.5 13M28 37h7" />
    <path d="M23.5 6v-3M20 7l-2-2M27 7l2-2" stroke={A} />
  </>),
  flowers: (<>
    <path d="M15 26h18l-9 17z" fill={T} />
    <path d="M24 26V16M19 26l-3-9M29 26l3-9" />
    <circle cx="24" cy="12" r="4.5" fill={W} stroke={W} /><circle cx="15" cy="14" r="4" stroke={A} /><circle cx="33" cy="14" r="4" stroke={A} />
  </>),
  cake: (<>
    <rect x="9" y="25" width="30" height="13" rx="2" fill={T} />
    <path d="M12 25v-5h24v5M6 42h36M9 31c3 2 5 2 7.5 0s5-2 7.5 0 5 2 7.5 0 5-2 7.5 0" />
    <path d="M24 20v-6" /><path d="M24 7c2 2 2 4 0 5-2-1-2-3 0-5z" fill={W} stroke={W} />
  </>),
  card: (<>
    <rect x="6" y="12" width="36" height="25" rx="3" fill={T} />
    <path d="M6 15l18 13 18-13" />
    <path d="M24 31.5c-2.4-1.8-4-3.2-4-4.8a2 2 0 0 1 4-0.6 2 2 0 0 1 4 0.6c0 1.6-1.6 3-4 4.8z" fill={A} stroke={A} strokeWidth="1.2" />
  </>),
  stones: (<>
    <ellipse cx="24" cy="38" rx="15" ry="4.5" fill={T} />
    <ellipse cx="24" cy="29" rx="11" ry="4" />
    <ellipse cx="24" cy="21" rx="7.5" ry="3.2" />
    <path d="M24 17c0-5 4-9 10-9 0 6-4 9-10 9z" stroke={A} />
  </>),
  tray: (<>
    <path d="M5 31h38M9 31l-2 9M39 31l2 9" />
    <path d="M13 31v-7h11v7" fill={T} /><path d="M24 25h2.5a2.5 2.5 0 0 1 0 5H24" />
    <path d="M29 31c0-5 4-8 9-6-1 3-3 5-6 6" fill={W} stroke={W} />
    <path d="M16 20c-1.5-2 1.5-3 0-5M21 20c-1.5-2 1.5-3 0-5" stroke={A} />
  </>),
  stars: (<>
    <circle cx="24" cy="26" r="16" fill={T} stroke="none" />
    <path d="M28 12a11 11 0 1 0 9 17 9 9 0 0 1-9-17z" />
    <path d="M12 9l1.2 2.8L16 13l-2.8 1.2L12 17l-1.2-2.8L8 13l2.8-1.2zM38 34l.9 2.1L41 37l-2.1.9L38 40l-.9-2.1L35 37l2.1-.9z" fill={W} stroke={W} strokeWidth="1" />
  </>),
  camera: (<>
    <rect x="6" y="14" width="36" height="24" rx="4" fill={T} />
    <path d="M17 14l3-5h8l3 5" />
    <circle cx="24" cy="26" r="7" /><circle cx="24" cy="26" r="2.5" stroke={A} />
    <path d="M35 19h2" />
  </>),
  clock: (<>
    <circle cx="24" cy="24" r="17" fill={T} />
    <path d="M24 13v11l7 4" />
    <path d="M35 6h5l-5 5h5" stroke={A} />
  </>),
  balloon: (<>
    <ellipse cx="22" cy="17" rx="10" ry="12" fill={T} />
    <path d="M20 29h4l-2 3zM22 32c-3 4 3 6 0 11" />
    <ellipse cx="34" cy="14" rx="6" ry="7.5" stroke={A} /><path d="M34 21.5c-2 4 2 7 0 10" stroke={A} />
  </>),
  ring: (<>
    <circle cx="24" cy="30" r="11" />
    <path d="M17 13h14l-7 8z" fill={T} /><path d="M17 13l3-5h8l3 5" />
    <path d="M38 8l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill={W} stroke={W} strokeWidth="1" />
  </>),
  candle: (<>
    <rect x="16" y="20" width="16" height="21" rx="2" fill={T} />
    <path d="M12 41h24M24 20v-4" />
    <path d="M24 5c3 3 3 7 0 9-3-2-3-6 0-9z" fill={W} stroke={W} />
  </>),
  board: (<>
    <path d="M6 30c0-4 3-7 7-7h22c4 0 7 3 7 7s-3 7-7 7H13c-4 0-7-3-7-7z" fill={T} />
    <path d="M42 30h4" /><path d="M13 30l7-6v6z" fill={W} stroke={W} />
    <circle cx="27" cy="28" r="2" stroke={A} /><circle cx="31" cy="26" r="2" stroke={A} /><circle cx="31" cy="31" r="2" stroke={A} /><circle cx="35" cy="28.5" r="2" stroke={A} />
  </>),
  robe: (<>
    <path d="M18 8l-8 5-5 11 5 3 3-5v21h22V22l3 5 5-3-5-11-8-5-6 8z" fill={T} />
    <path d="M18 8l6 12 6-12M13 30h22" />
  </>),
  music: (<>
    <circle cx="24" cy="24" r="17" fill={T} stroke="none" />
    <path d="M19 33V13l15-3v19" />
    <circle cx="15.5" cy="33" r="3.5" /><circle cx="30.5" cy="29" r="3.5" />
  </>),
  door: (<>
    <path d="M10 42V6h22v36" />
    <path d="M32 6l8 3v36l-8-3" fill={W} stroke={W} opacity="0.35" />
    <path d="M10 42h30" /><circle cx="27" cy="25" r="1.4" fill="currentColor" />
  </>),
  shield: (<>
    <path d="M24 5l15 5v11c0 10-6 17-15 22C15 38 9 31 9 21V10z" fill={T} />
    <path d="M17 23l5 5 9-10" stroke={A} />
  </>),
  iron: (<>
    <path d="M8 34c0-9 7-16 18-16h10v16z" fill={T} />
    <path d="M14 18c0-5 4-8 9-8h13v8M4 38h38" />
    <path d="M16 6c-1 1 1 2 0 3M21 5c-1 1 1 2 0 3" stroke={A} />
  </>),
  thermo: (<>
    <circle cx="24" cy="24" r="16" fill={T} />
    <circle cx="24" cy="24" r="9" />
    <path d="M24 24l5-5" stroke={A} />
    <path d="M24 8v3M40 24h-3M8 24h3" />
  </>),
  water: (<>
    <path d="M17 12h14v28a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3z" fill={T} />
    <path d="M19 12V7h10v5M17 22h14" />
    <path d="M24 28c-2 3-2 5 0 6 2-1 2-3 0-6z" stroke={A} />
  </>),
  gym: (<>
    <path d="M14 24h20" />
    <rect x="8" y="15" width="6" height="18" rx="2" fill={T} />
    <rect x="34" y="15" width="6" height="18" rx="2" fill={T} />
    <path d="M4 20v8M44 20v8" />
  </>),
  bag: (<>
    <rect x="8" y="15" width="32" height="25" rx="4" fill={T} />
    <path d="M18 15v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4M8 25h32" />
    <rect x="21" y="23" width="6" height="5" rx="1.5" stroke={A} />
  </>),
  heart: (<>
    <circle cx="24" cy="24" r="17" fill={T} stroke="none" />
    <path d="M24 37C15 31 9 26 9 19a7 7 0 0 1 15-3 7 7 0 0 1 15 3c0 7-6 12-15 18z" />
  </>),
  building: (<>
    <path d="M8 42V14l12-6v34M20 42V18h20v24M4 42h40" />
    <path d="M12 18h4M12 24h4M12 30h4M25 24h3M32 24h3M25 30h3M32 30h3" stroke={A} />
    <rect x="27" y="35" width="6" height="7" fill={T} />
  </>),
  team: (<>
    <circle cx="17" cy="16" r="5" fill={T} /><circle cx="31" cy="16" r="5" fill={T} />
    <path d="M7 38c0-6 4.5-10 10-10s10 4 10 10M21 38c0-6 4.5-10 10-10s10 4 10 10" />
  </>),
  briefcase: (<>
    <rect x="6" y="15" width="36" height="24" rx="4" fill={T} />
    <path d="M18 15v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M6 25h36M22 25v3h4v-3" />
  </>),
  home: (<>
    <path d="M10 22v19h28V22" fill={T} />
    <path d="M5 24L24 8l19 16M20 41V30h8v11" />
  </>),
  pin: (<>
    <path d="M24 43s13-12 13-23a13 13 0 0 0-26 0c0 11 13 23 13 23z" fill={T} />
    <circle cx="24" cy="20" r="5" />
  </>),
  check: (<>
    <circle cx="24" cy="24" r="17" fill={T} stroke="none" />
    <path d="M15 24.5l6 6 12-13" />
  </>),
};

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 44, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <svg className={`lp-icon ${className}`} width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name] ?? ICONS.check}
    </svg>
  );
}

/* ─── Spot illustrations ─── */

/** Business: the "leave it here" closet — shirts waiting, labelled bin, shoes. */
export function ClosetScene() {
  return (
    <svg className="lp-spot" viewBox="0 0 340 260" fill="none" stroke="var(--ill-line)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="A closet with pressed shirts hanging, a labelled storage bin and running shoes waiting for the guest">
      <rect x="40" y="18" width="260" height="226" rx="10" fill="var(--ill-paper)" />
      <path d="M40 244h260" />
      <path d="M58 52h224" strokeWidth="3" />
      {/* shirts */}
      {[0, 1, 2].map((i) => {
        const x = 78 + i * 62;
        const fills = ["var(--ill-tint)", "var(--ill-paper)", "var(--ill-tint)"];
        return (
          <g key={i}>
            <path d={`M${x + 22} 52c0-6 6-6 6-1`} />
            <path d={`M${x + 28} 56l-24 10 2 18 10-3v62h26V81l10 3 2-18-24-10z`} fill={fills[i]} />
            <path d={`M${x + 22} 56l6 10 6-10`} />
            <path d={`M${x + 28} 66v66`} strokeDasharray="1 8" />
          </g>
        );
      })}
      {/* shelf + bin */}
      <path d="M58 168h224" strokeWidth="3" />
      <rect x="150" y="128" width="112" height="40" rx="5" fill="var(--ill-accent-soft)" />
      <path d="M150 140h112" />
      <rect x="180" y="148" width="52" height="14" rx="3" fill="var(--ill-paper)" />
      <text x="206" y="158.5" textAnchor="middle" fontSize="8.5" fontFamily="DM Sans, sans-serif" fontWeight="700" fill="var(--ill-line)" stroke="none" letterSpacing="0.6">BACK MON</text>
      {/* laptop stand + monitor box on shelf left */}
      <rect x="72" y="140" width="56" height="28" rx="3" fill="var(--ill-tint)" />
      <path d="M80 150h40M80 158h26" />
      {/* shoes */}
      <path d="M78 236c0-9 6-14 14-14l8 6h14c6 0 9 4 9 8z" fill="var(--ill-accent-soft)" />
      <path d="M128 236c0-9 6-14 14-14l8 6h14c6 0 9 4 9 8z" fill="var(--ill-accent-soft)" />
      <path d="M96 228l4-3M146 228l4-3" />
      {/* tag */}
      <path d="M262 92l14 8v26h-20V100z" fill="var(--ill-warm-soft)" />
      <circle cx="266" cy="104" r="2.5" />
      <path d="M266 101c-6-8-10-24-6-40" strokeDasharray="2 4" />
    </svg>
  );
}

/** Couples: the late-arrival table — board, bubbly on ice, two flutes, candle, flowers, card. */
export function ArrivalTableScene() {
  return (
    <svg className="lp-spot" viewBox="10 56 362 210" fill="none" stroke="var(--ill-line)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="A table set for two on arrival: a cheese board, sparkling wine on ice, two glasses, a candle, flowers and a handwritten card">
      {/* warm glow */}
      <circle cx="170" cy="150" r="96" fill="var(--ill-warm-soft)" stroke="none" />
      {/* table */}
      <path d="M20 206h340" strokeWidth="3" />
      <path d="M46 206l-12 56M334 206l12 56" />
      {/* vase + flowers */}
      <path d="M58 206c-6-18-4-34 8-42h16c12 8 14 24 8 42z" fill="var(--ill-tint)" />
      <path d="M74 164v-40M74 150c-10-6-16-16-14-30M74 146c10-6 16-14 16-28" />
      <circle cx="74" cy="114" r="12" fill="var(--ill-accent-soft)" />
      <circle cx="58" cy="112" r="9" fill="var(--ill-warm-soft)" />
      <circle cx="92" cy="110" r="9" fill="var(--ill-warm-soft)" />
      <circle cx="74" cy="114" r="4" />
      {/* candle */}
      <rect x="112" y="150" width="20" height="56" rx="3" fill="var(--ill-paper)" />
      <path d="M122 150v-8" />
      <path d="M122 124c5 5 5 12 0 15-5-3-5-10 0-15z" fill="var(--ill-warm)" stroke="var(--ill-warm)" />
      {/* ice bucket + bottle */}
      <path d="M212 112v-34h12v34" />
      <path d="M206 130c0-12 4-18 12-18s12 6 12 18v40h-24z" fill="var(--ill-accent)" stroke="var(--ill-line)" />
      <rect x="208" y="140" width="20" height="16" rx="2" fill="var(--ill-paper)" />
      <path d="M190 158h56l-6 48h-44z" fill="var(--ill-tint)" />
      <path d="M196 166h44" />
      {/* flutes */}
      <path d="M262 132h18l-2 30a7 7 0 0 1-14 0z" fill="var(--ill-warm-soft)" />
      <path d="M271 169v30M262 206h18" />
      <path d="M292 132h18l-2 30a7 7 0 0 1-14 0z" fill="var(--ill-warm-soft)" />
      <path d="M301 169v30M292 206h18" />
      <circle cx="270" cy="146" r="1.6" /><circle cx="274" cy="139" r="1.2" /><circle cx="302" cy="148" r="1.6" /><circle cx="298" cy="140" r="1.2" />
      {/* board, in front of the bucket */}
      <path d="M128 206v-5c0-6 4-9 10-9h108c6 0 10 3 10 9v5z" fill="var(--ill-warm-soft)" />
      <path d="M256 199h14" />
      <path d="M140 192l28-20v20z" fill="var(--ill-warm)" />
      <rect x="172" y="176" width="22" height="16" rx="2" fill="var(--ill-paper)" />
      <path d="M178 182h2M186 186h2" />
      <circle cx="204" cy="185" r="5" fill="var(--ill-accent-soft)" /><circle cx="214" cy="181" r="5" fill="var(--ill-accent-soft)" /><circle cx="214" cy="190" r="5" fill="var(--ill-accent-soft)" /><circle cx="223" cy="186" r="5" fill="var(--ill-accent-soft)" />
      <circle cx="238" cy="186" r="6" fill="var(--ill-paper)" /><circle cx="246" cy="189" r="5" fill="var(--ill-paper)" />
      {/* card */}
      <path d="M318 206l8-30 34 9-8 21z" fill="var(--ill-paper)" />
      <path d="M330 186l20 5M328 193l14 4" />
    </svg>
  );
}

/** "More coming soon" — a small Toronto skyline with a few lit windows. */
export function SkylineScene() {
  return (
    <svg className="lp-spot" viewBox="0 0 320 170" fill="none" stroke="var(--ill-line)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Toronto skyline with a few windows lit">
      <circle cx="250" cy="50" r="26" fill="var(--ill-warm-soft)" stroke="none" />
      <path d="M10 150h300" strokeWidth="3" />
      {/* tower */}
      <path d="M150 150V60M146 150l2-70M154 150l-2-70" />
      <ellipse cx="150" cy="62" rx="10" ry="6" fill="var(--ill-tint)" />
      <path d="M150 56V20" />
      <rect x="30" y="90" width="34" height="60" fill="var(--ill-tint)" />
      <rect x="70" y="70" width="30" height="80" fill="var(--ill-paper)" />
      <rect x="104" y="100" width="30" height="50" fill="var(--ill-tint)" />
      <rect x="170" y="84" width="34" height="66" fill="var(--ill-paper)" />
      <rect x="210" y="104" width="28" height="46" fill="var(--ill-tint)" />
      <rect x="244" y="78" width="40" height="72" fill="var(--ill-paper)" />
      {[[38, 100], [50, 116], [78, 84], [88, 104], [78, 124], [112, 112], [178, 96], [190, 116], [252, 92], [266, 112], [252, 132], [216, 118]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="7" height="8" rx="1" fill={i % 3 === 0 ? "var(--ill-warm)" : "none"} strokeWidth="1.5" />
      ))}
    </svg>
  );
}
