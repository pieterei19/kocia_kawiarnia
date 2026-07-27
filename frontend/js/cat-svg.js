// Płaska, wektorowa grafika kotków w stylu "kawaii sticker": gruby czarny
// kontur, duże błyszczące oczy, miękkie cieniowanie gradientem (pseudo-3D
// bez pełnej geometrii 3D) - zamiast wcześniejszych modeli Three.js.

export const CAT_STYLES = {
  milus: {
    name: "Lucjan",
    body: "#2f2b28",
    bodyDark: "#141210",
    patch: "#fdf6ec",
    ear: "#f4b8c9",
    blush: "#f6a8c0",
    nose: "#f19aa4",
    chestPatch: true,
    forehead_star: true,
  },
  czarny: {
    name: "Sadza",
    body: "#3a332e",
    bodyDark: "#1a1613",
    patch: "#4d443c",
    ear: "#6b564a",
    blush: "#c98a8a",
    nose: "#caa08f",
  },
  "biały": {
    name: "Śnieżek",
    body: "#fffaf3",
    bodyDark: "#e9dfce",
    patch: "#f0e6d8",
    ear: "#f6c9d6",
    blush: "#f6a8c0",
    nose: "#f19aa4",
  },
  tygrys: {
    name: "Tygrysek",
    body: "#f0a94e",
    bodyDark: "#cf8027",
    patch: "#fef1de",
    ear: "#f6c9d6",
    blush: "#f6a8c0",
    nose: "#f19aa4",
    stripes: true,
  },
  lew: {
    name: "Leon",
    body: "#f4c95a",
    bodyDark: "#d99a2b",
    patch: "#fff2cf",
    ear: "#f6c9d6",
    blush: "#f6a8c0",
    nose: "#f19aa4",
    mane: true,
  },
  panda: {
    name: "Bambusek",
    body: "#fefefe",
    bodyDark: "#e4e4e4",
    patch: "#2b2420",
    ear: "#2b2420",
    blush: "#f6a8c0",
    nose: "#3a2a20",
    eyeRings: true,
  },
  koala: {
    name: "Koalek",
    body: "#cfc8c0",
    bodyDark: "#a89e93",
    patch: "#e8dfd6",
    ear: "#e8c4cc",
    blush: "#f6a8c0",
    nose: "#5a4a42",
    bigEars: true,
  },
  lis: {
    name: "Lisek",
    body: "#f2955a",
    bodyDark: "#d8703a",
    patch: "#fefaf3",
    ear: "#3a2a20",
    blush: "#f6a8c0",
    nose: "#3a2a20",
    chestPatch: true,
  },
};

let uid = 0;

export function catSvgMarkup(colorKey) {
  const s = CAT_STYLES[colorKey] || CAT_STYLES.milus;
  uid++;
  const bodyGrad = "catBody" + uid;
  const headGrad = "catHead" + uid;
  const outline = "#241b14";

  const earShape = s.bigEars
    ? `<path d="M30 58 Q18 8 62 30 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
       <path d="M138 58 Q150 8 106 30 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
       <path d="M38 52 Q32 24 56 34 Z" fill="${s.ear}"/>
       <path d="M130 52 Q136 24 112 34 Z" fill="${s.ear}"/>`
    : `<path d="M38 56 Q30 16 60 32 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
       <path d="M130 56 Q138 16 108 32 Z" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
       <path d="M43 50 Q38 28 57 37 Z" fill="${s.ear}"/>
       <path d="M125 50 Q130 28 111 37 Z" fill="${s.ear}"/>`;

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

  return `
  <svg viewBox="0 0 168 190" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${bodyGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${s.body}"/>
        <stop offset="100%" stop-color="${s.bodyDark}"/>
      </linearGradient>
      <linearGradient id="${headGrad}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${s.body}"/>
        <stop offset="100%" stop-color="${s.bodyDark}"/>
      </linearGradient>
    </defs>

    <ellipse cx="84" cy="180" rx="46" ry="8" fill="#3a2a1c" opacity="0.16"/>

    <path d="M118 132 Q150 118 152 88 Q154 66 138 60 Q150 78 140 100 Q132 118 112 130 Z"
      fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>

    ${mane}
    ${earShape}

    <ellipse cx="84" cy="150" rx="58" ry="34" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="5"/>
    ${chestPatch}

    <ellipse cx="46" cy="168" rx="15" ry="11" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4"/>
    <ellipse cx="122" cy="168" rx="15" ry="11" fill="url(#${bodyGrad})" stroke="${outline}" stroke-width="4"/>

    <circle cx="84" cy="96" r="52" fill="url(#${headGrad})" stroke="${outline}" stroke-width="5"/>

    ${stripes}
    ${eyeRings}
    ${foreheadStar}

    <ellipse cx="46" cy="103" rx="17" ry="6" fill="${s.blush}" opacity="0.6"/>
    <ellipse cx="122" cy="103" rx="17" ry="6" fill="${s.blush}" opacity="0.6"/>

    <ellipse cx="61" cy="97" rx="14" ry="17" fill="#241b14"/>
    <ellipse cx="107" cy="97" rx="14" ry="17" fill="#241b14"/>
    <circle cx="66" cy="88" r="4.5" fill="#fff"/>
    <circle cx="112" cy="88" r="4.5" fill="#fff"/>
    <circle cx="57" cy="103" r="2.2" fill="#fff" opacity="0.85"/>
    <circle cx="103" cy="103" r="2.2" fill="#fff" opacity="0.85"/>

    <path d="M79 112 Q84 117 89 112 Q84 108 79 112 Z" fill="${s.nose}" stroke="${outline}" stroke-width="1.5"/>
    <path d="M78 116 Q84 122 90 116" stroke="${outline}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </svg>`;
}
