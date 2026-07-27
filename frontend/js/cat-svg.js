// Płaska, wektorowa grafika kotków w stylu "kawaii sticker": gruby czarny
// kontur, duże błyszczące oczy, miękkie cieniowanie gradientem (pseudo-3D
// bez pełnej geometrii 3D). Każdy kotek ma własną pozę/gadżet dopasowany
// do jego charakteru, zamiast jednego powtarzalnego szablonu.

export const CAT_STYLES = {
  milus: {
    name: "Lucjan",
    pose: "sitting",
    body: "#2f2b28",
    bodyDark: "#141210",
    patch: "#fdf6ec",
    ear: "#f4b8c9",
    blush: "#f6a8c0",
    nose: "#f19aa4",
    chestPatch: true,
    forehead_star: true,
    prop: "moon",
  },
  czarny: {
    name: "Sadza",
    pose: "curled",
    body: "#3a332e",
    bodyDark: "#1a1613",
    patch: "#4d443c",
    ear: "#6b564a",
    blush: "#c98a8a",
    nose: "#caa08f",
  },
  "biały": {
    name: "Śnieżek",
    pose: "lying",
    body: "#fffaf3",
    bodyDark: "#e9dfce",
    patch: "#f0e6d8",
    ear: "#f6c9d6",
    blush: "#f6a8c0",
    nose: "#f19aa4",
  },
  tygrys: {
    name: "Tygrysek",
    pose: "sitting",
    body: "#f0a94e",
    bodyDark: "#cf8027",
    patch: "#fef1de",
    ear: "#f6c9d6",
    blush: "#f6a8c0",
    nose: "#f19aa4",
    stripes: true,
    prop: "yarn",
  },
  lew: {
    name: "Leon",
    pose: "sitting",
    body: "#f4c95a",
    bodyDark: "#d99a2b",
    patch: "#fff2cf",
    ear: "#f6c9d6",
    blush: "#f6a8c0",
    nose: "#f19aa4",
    mane: true,
    prop: "sparkle",
  },
  panda: {
    name: "Bambusek",
    pose: "sitting",
    body: "#fefefe",
    bodyDark: "#e4e4e4",
    patch: "#2b2420",
    ear: "#2b2420",
    blush: "#f6a8c0",
    nose: "#3a2a20",
    eyeRings: true,
    prop: "bamboo",
  },
  koala: {
    name: "Koalek",
    pose: "sitting",
    body: "#cfc8c0",
    bodyDark: "#a89e93",
    patch: "#e8dfd6",
    ear: "#e8c4cc",
    blush: "#f6a8c0",
    nose: "#5a4a42",
    bigEars: true,
    prop: "leaf",
  },
  lis: {
    name: "Lisek",
    pose: "standing",
    body: "#f2955a",
    bodyDark: "#d8703a",
    patch: "#fefaf3",
    ear: "#3a2a20",
    blush: "#f6a8c0",
    nose: "#3a2a20",
    chestPatch: true,
  },
};

const OUTLINE = "#241b14";
let uid = 0;

function eyesAndFace(cx1, cx2, cy, s) {
  return `
    <ellipse cx="${cx1 - 15}" cy="${cy + 7}" rx="17" ry="6" fill="${s.blush}" opacity="0.6"/>
    <ellipse cx="${cx2 + 15}" cy="${cy + 7}" rx="17" ry="6" fill="${s.blush}" opacity="0.6"/>
    <ellipse cx="${cx1}" cy="${cy + 1}" rx="14" ry="17" fill="${OUTLINE}"/>
    <ellipse cx="${cx2}" cy="${cy + 1}" rx="14" ry="17" fill="${OUTLINE}"/>
    <circle cx="${cx1 + 5}" cy="${cy - 8}" r="4.5" fill="#fff"/>
    <circle cx="${cx2 + 5}" cy="${cy - 8}" r="4.5" fill="#fff"/>
    <circle cx="${cx1 - 4}" cy="${cy + 7}" r="2.2" fill="#fff" opacity="0.85"/>
    <circle cx="${cx2 - 4}" cy="${cy + 7}" r="2.2" fill="#fff" opacity="0.85"/>
    <path d="M${(cx1 + cx2) / 2 - 5} ${cy + 16} Q${(cx1 + cx2) / 2} ${cy + 21} ${(cx1 + cx2) / 2 + 5} ${cy + 16} Q${(cx1 + cx2) / 2} ${cy + 12} ${(cx1 + cx2) / 2 - 5} ${cy + 16} Z"
      fill="${s.nose}" stroke="${OUTLINE}" stroke-width="1.5"/>
    <path d="M${(cx1 + cx2) / 2 - 5} ${cy + 20} Q${(cx1 + cx2) / 2} ${cy + 26} ${(cx1 + cx2) / 2 + 5} ${cy + 20}"
      stroke="${OUTLINE}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
}

const PROPS = {
  moon: (bodyGrad) => `
    <g transform="translate(132,116)">
      <path d="M0 16 Q-13 9 -10 -5 Q2 -14 14 -7 Q3 -7 -2 2 Q-5 10 0 16 Z" fill="#f4c95a" stroke="${OUTLINE}" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="-16" cy="-11" r="2.2" fill="#f4c95a"/>
      <circle cx="-21" cy="-2" r="1.4" fill="#f4c95a"/>
    </g>`,
  yarn: () => `
    <g transform="translate(112,152)">
      <circle r="17" fill="#e0798c" stroke="${OUTLINE}" stroke-width="3"/>
      <path d="M-14 -4 Q0 -16 14 -4" stroke="#c15a6c" stroke-width="2" fill="none"/>
      <path d="M-15 4 Q0 15 15 4" stroke="#c15a6c" stroke-width="2" fill="none"/>
      <path d="M-16 -1 Q0 3 16 -1" stroke="#c15a6c" stroke-width="2" fill="none"/>
      <path d="M14 8 Q26 14 30 26" stroke="#e0798c" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>`,
  sparkle: () => `
    <g fill="#fff2cf" stroke="${OUTLINE}" stroke-width="1.5" stroke-linejoin="round">
      <path d="M26 40 l2.4 5.8 6.2 0.5 -4.7 4 1.5 6.1 -5.4 -3.4 -5.4 3.4 1.5 -6.1 -4.7 -4 6.2 -0.5 Z" transform="scale(0.9)"/>
      <path d="M150 52 l1.8 4.4 4.7 0.4 -3.6 3 1.2 4.6 -4.1 -2.6 -4.1 2.6 1.2 -4.6 -3.6 -3 4.7 -0.4 Z" transform="scale(0.9)"/>
    </g>`,
  bamboo: () => `
    <g transform="translate(84,150) rotate(-18)">
      <rect x="-7" y="-30" width="14" height="52" rx="6" fill="#a8cf7a" stroke="${OUTLINE}" stroke-width="3"/>
      <rect x="-7" y="-8" width="14" height="4" fill="#7fa858"/>
      <rect x="-7" y="8" width="14" height="4" fill="#7fa858"/>
      <path d="M-2 -30 Q-16 -42 -30 -36 Q-14 -34 -4 -24 Z" fill="#6fa06a" stroke="${OUTLINE}" stroke-width="2"/>
      <path d="M4 -30 Q18 -40 30 -32 Q16 -32 6 -22 Z" fill="#6fa06a" stroke="${OUTLINE}" stroke-width="2"/>
    </g>`,
  leaf: () => `
    <g transform="translate(88,152)">
      <path d="M0 16 Q-14 6 -8 -10 Q4 -18 14 -6 Q16 8 0 16 Z" fill="#8fbf8a" stroke="${OUTLINE}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M0 14 Q0 0 6 -10" stroke="#4f7a4c" stroke-width="1.5" fill="none"/>
      <path d="M20 20 Q4 12 -2 20 Q10 26 20 20 Z" fill="#8fbf8a" stroke="${OUTLINE}" stroke-width="2.5" stroke-linejoin="round"/>
    </g>`,
};

function earShapeMarkup(s, bodyGrad, outline) {
  return s.bigEars
    ? `<path d="M30 58 Q18 8 62 30 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
       <path d="M138 58 Q150 8 106 30 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
       <path d="M38 52 Q32 24 56 34 Z" fill="${s.ear}"/>
       <path d="M130 52 Q136 24 112 34 Z" fill="${s.ear}"/>`
    : `<path d="M38 56 Q30 16 60 32 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
       <path d="M130 56 Q138 16 108 32 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
       <path d="M43 50 Q38 28 57 37 Z" fill="${s.ear}"/>
       <path d="M125 50 Q130 28 111 37 Z" fill="${s.ear}"/>`;
}

function sittingCat(s, bodyGrad, headGrad, outline) {
  const mane = s.mane
    ? `<path d="M22 70 Q10 40 30 20 Q40 10 50 22 Q60 8 84 8 Q108 8 118 22 Q128 10 138 20 Q158 40 146 70 Q150 100 130 118 L38 118 Q18 100 22 70 Z"
         fill="${s.patch}" stroke="${outline}" stroke-width="3" opacity="0.9"/>`
    : "";
  const stripes = s.stripes
    ? `<g fill="${s.bodyDark}" opacity="0.55">
         <path d="M55 30 Q60 24 66 30 Q60 34 55 30 Z"/>
         <path d="M100 30 Q106 24 112 30 Q106 34 100 30 Z"/>
         <path d="M40 95 Q55 88 62 96 Q52 102 40 95 Z"/>
         <path d="M108 96 Q118 88 130 95 Q118 102 108 96 Z"/>
       </g>`
    : "";
  const eyeRings = s.eyeRings
    ? `<ellipse cx="60" cy="88" rx="19" ry="23" fill="${s.patch}" transform="rotate(-8 60 88)"/>
       <ellipse cx="108" cy="88" rx="19" ry="23" fill="${s.patch}" transform="rotate(8 108 88)"/>`
    : "";
  const chestPatch = s.chestPatch
    ? `<ellipse cx="84" cy="150" rx="30" ry="26" fill="${s.patch}" stroke="${outline}" stroke-width="3"/>`
    : "";
  const foreheadStar = s.forehead_star
    ? `<path d="M84 58 l3.2 7.8 8.4 0.6 -6.4 5.4 2 8.2 -7.2 -4.6 -7.2 4.6 2 -8.2 -6.4 -5.4 8.4 -0.6 Z"
         fill="#fdf6ec" stroke="${outline}" stroke-width="2" stroke-linejoin="round"/>`
    : "";
  const prop = s.prop && PROPS[s.prop] ? PROPS[s.prop](bodyGrad) : "";

  return `
  <svg viewBox="0 0 168 190" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${bodyGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${s.body}"/><stop offset="100%" stop-color="${s.bodyDark}"/>
      </linearGradient>
      <linearGradient id="${headGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${s.body}"/><stop offset="100%" stop-color="${s.bodyDark}"/>
      </linearGradient>
    </defs>
    <ellipse cx="84" cy="180" rx="46" ry="8" fill="#3a2a1c" opacity="0.16"/>
    <path d="M118 132 Q150 118 152 88 Q154 66 138 60 Q150 78 140 100 Q132 118 112 130 Z"
      fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    ${mane}
    ${earShapeMarkup(s, bodyGrad, outline)}
    <ellipse cx="84" cy="150" rx="58" ry="34" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="5"/>
    ${chestPatch}
    <ellipse cx="46" cy="168" rx="15" ry="11" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4"/>
    <ellipse cx="122" cy="168" rx="15" ry="11" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4"/>
    <circle cx="84" cy="96" r="52" fill="url(#${headGrad})" stroke="${outline}" stroke-width="5"/>
    ${stripes}
    ${eyeRings}
    ${foreheadStar}
    ${eyesAndFace(61, 107, 97, s)}
    ${prop}
  </svg>`;
}

function curledCat(s, bodyGrad, headGrad, outline) {
  return `
  <svg viewBox="0 0 190 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${bodyGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${s.body}"/><stop offset="100%" stop-color="${s.bodyDark}"/>
      </linearGradient>
    </defs>
    <ellipse cx="95" cy="140" rx="70" ry="9" fill="#3a2a1c" opacity="0.16"/>
    <path d="M150 100 Q170 80 158 55 Q148 66 148 84 Q142 100 122 108 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="95" cy="95" rx="80" ry="42" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="5"/>
    <path d="M48 62 Q38 30 66 42 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M92 60 Q88 26 116 40 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M52 58 Q46 38 64 46 Z" fill="${s.ear}"/>
    <path d="M96 56 Q94 34 112 42 Z" fill="${s.ear}"/>
    <circle cx="66" cy="88" r="46" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="5"/>
    <ellipse cx="40" cy="98" rx="14" ry="5" fill="${s.blush}" opacity="0.55"/>
    <ellipse cx="80" cy="98" rx="14" ry="5" fill="${s.blush}" opacity="0.55"/>
    <path d="M40 84 Q48 78 56 84" stroke="${outline}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M76 84 Q84 78 92 84" stroke="${outline}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M60 100 Q66 105 72 100 Q66 96 60 100 Z" fill="${s.nose}" stroke="${outline}" stroke-width="1.5"/>
  </svg>`;
}

function lyingCat(s, bodyGrad, headGrad, outline) {
  const bumps = [18, 40, 60, 130, 152, 172]
    .map((x) => `<circle cx="${x}" cy="58" r="9" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="3"/>`)
    .join("");
  return `
  <svg viewBox="0 0 210 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${bodyGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${s.body}"/><stop offset="100%" stop-color="${s.bodyDark}"/>
      </linearGradient>
    </defs>
    <ellipse cx="105" cy="140" rx="86" ry="9" fill="#3a2a1c" opacity="0.16"/>
    <ellipse cx="120" cy="98" rx="82" ry="38" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="5"/>
    ${bumps}
    <ellipse cx="46" cy="118" rx="17" ry="10" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4"/>
    <ellipse cx="78" cy="120" rx="17" ry="10" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4"/>
    <path d="M28 66 Q18 30 48 42 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M72 62 Q70 26 98 38 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M33 62 Q27 40 45 48 Z" fill="${s.ear}"/>
    <path d="M76 60 Q74 38 92 44 Z" fill="${s.ear}"/>
    <circle cx="52" cy="88" r="46" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="5"/>
    ${eyesAndFace(34, 70, 88, s)}
    <g transform="translate(24,44) rotate(-12)">
      <circle r="9" fill="#fdf6ec" stroke="${outline}" stroke-width="2.5"/>
      <circle r="4.5" fill="#f6c9d6"/>
      <circle cx="9" cy="-4" r="6" fill="#fdf6ec" stroke="${outline}" stroke-width="2"/>
      <circle cx="9" cy="4" r="6" fill="#fdf6ec" stroke="${outline}" stroke-width="2"/>
      <circle cx="-9" cy="-4" r="6" fill="#fdf6ec" stroke="${outline}" stroke-width="2"/>
      <circle cx="-9" cy="4" r="6" fill="#fdf6ec" stroke="${outline}" stroke-width="2"/>
    </g>
  </svg>`;
}

function standingCat(s, bodyGrad, headGrad, outline) {
  const chestPatch = s.chestPatch
    ? `<ellipse cx="70" cy="150" rx="24" ry="32" fill="${s.patch}" stroke="${outline}" stroke-width="3"/>`
    : "";
  return `
  <svg viewBox="0 0 140 210" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${bodyGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${s.body}"/><stop offset="100%" stop-color="${s.bodyDark}"/>
      </linearGradient>
    </defs>
    <ellipse cx="70" cy="202" rx="42" ry="8" fill="#3a2a1c" opacity="0.16"/>
    <path d="M98 158 Q128 162 122 132 Q118 112 102 116 Q114 132 102 152 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="46" cy="190" rx="16" ry="12" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4"/>
    <ellipse cx="94" cy="190" rx="16" ry="12" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4"/>
    <ellipse cx="70" cy="150" rx="44" ry="50" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="5"/>
    ${chestPatch}
    <ellipse cx="19" cy="128" rx="13" ry="18" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4"/>
    <ellipse cx="121" cy="128" rx="13" ry="18" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4"/>
    <path d="M36 56 Q26 4 62 26 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M104 56 Q114 4 78 26 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M41 50 Q35 18 58 32 Z" fill="${s.ear}"/>
    <path d="M99 50 Q105 18 82 32 Z" fill="${s.ear}"/>
    <circle cx="70" cy="68" r="42" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="5"/>
    ${eyesAndFace(51, 89, 68, s)}
    <g transform="translate(70,120)">
      <rect x="-13" y="-6" width="26" height="20" rx="4" fill="#fdf6ec" stroke="${outline}" stroke-width="2.5"/>
      <path d="M13 0 Q24 0 24 8 Q24 14 13 12" fill="none" stroke="${outline}" stroke-width="2.5"/>
      <path d="M-8 -10 Q-6 -18 -2 -10" stroke="#c9b8a0" stroke-width="2" fill="none"/>
      <path d="M2 -10 Q4 -18 8 -10" stroke="#c9b8a0" stroke-width="2" fill="none"/>
    </g>
  </svg>`;
}

export function catSvgMarkup(colorKey) {
  const s = CAT_STYLES[colorKey] || CAT_STYLES.milus;
  uid++;
  const bodyGrad = "catBody" + uid;
  const headGrad = "catHead" + uid;

  if (s.pose === "curled") return curledCat(s, bodyGrad, headGrad, OUTLINE);
  if (s.pose === "lying") return lyingCat(s, bodyGrad, headGrad, OUTLINE);
  if (s.pose === "standing") return standingCat(s, bodyGrad, headGrad, OUTLINE);
  return sittingCat(s, bodyGrad, headGrad, OUTLINE);
}
