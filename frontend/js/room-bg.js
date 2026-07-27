// Stałe tło pokoiku w klimacie kociej kawiarni: okno, lada z ekspresem,
// tablica z menu, roślinka - dekoracje z sklepu (poduszka, miska, kulka...)
// są renderowane osobno na wierzchu tego tła.
export function roomBackgroundSvg() {
  return `
  <svg viewBox="0 0 520 300" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f6e8d2"/>
        <stop offset="100%" stop-color="#eddab9"/>
      </linearGradient>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#cfe8f2"/>
        <stop offset="100%" stop-color="#eaf6f2"/>
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="520" height="185" fill="url(#wallGrad)"/>
    <rect x="0" y="182" width="520" height="6" fill="#d9a86a" opacity="0.5"/>

    <!-- okno -->
    <g transform="translate(28,26)">
      <rect x="-6" y="-6" width="112" height="102" rx="10" fill="#e8823c" opacity="0.18"/>
      <rect x="0" y="0" width="100" height="90" rx="8" fill="#8a5a35" stroke="#5a3a20" stroke-width="3"/>
      <rect x="6" y="6" width="88" height="78" fill="url(#skyGrad)"/>
      <circle cx="70" cy="22" r="10" fill="#fff7e6" opacity="0.85"/>
      <path d="M14 68 Q26 48 40 68 Q50 52 64 68 Q76 54 90 68 L90 80 L14 80 Z" fill="#8fbf8a" opacity="0.85"/>
      <rect x="6" y="6" width="88" height="78" fill="none" stroke="#5a3a20" stroke-width="2"/>
      <line x1="50" y1="6" x2="50" y2="84" stroke="#5a3a20" stroke-width="2"/>
      <line x1="6" y1="45" x2="94" y2="45" stroke="#5a3a20" stroke-width="2"/>
    </g>

    <!-- tablica z menu -->
    <g transform="translate(210,18)">
      <rect x="0" y="0" width="86" height="58" rx="6" fill="#4a3626" stroke="#2e2015" stroke-width="3"/>
      <g stroke="#e8d9c2" stroke-width="2.5" stroke-linecap="round" opacity="0.9">
        <line x1="12" y1="16" x2="60" y2="16"/>
        <line x1="12" y1="27" x2="70" y2="27"/>
        <line x1="12" y1="38" x2="52" y2="38"/>
        <line x1="12" y1="48" x2="64" y2="48"/>
      </g>
    </g>

    <!-- lada z ekspresem -->
    <g transform="translate(372,96)">
      <rect x="0" y="0" width="132" height="86" rx="6" fill="#c98a4e" stroke="#8a5a30" stroke-width="3"/>
      <rect x="6" y="6" width="120" height="18" rx="3" fill="#e8c48a" opacity="0.7"/>
      <g transform="translate(18,-46)">
        <rect x="0" y="20" width="70" height="34" rx="4" fill="#8a8a90" stroke="#4a4a50" stroke-width="3"/>
        <rect x="6" y="0" width="20" height="24" rx="3" fill="#6f6f76" stroke="#4a4a50" stroke-width="2.5"/>
        <rect x="34" y="0" width="20" height="24" rx="3" fill="#6f6f76" stroke="#4a4a50" stroke-width="2.5"/>
        <circle cx="16" cy="40" r="4" fill="#4a4a50"/>
        <circle cx="54" cy="40" r="4" fill="#4a4a50"/>
        <rect x="60" y="24" width="14" height="10" rx="2" fill="#4a4a50"/>
      </g>
    </g>

    <!-- roślinka na parapecie -->
    <g transform="translate(150,142)">
      <rect x="0" y="18" width="26" height="20" rx="4" fill="#c97a4a" stroke="#8a5030" stroke-width="2.5"/>
      <path d="M13 18 Q4 2 13 -10 Q22 2 13 18 Z" fill="#6fa06a" stroke="#3f6a3c" stroke-width="2"/>
      <path d="M13 18 Q-2 8 -8 -6" fill="none" stroke="#6fa06a" stroke-width="6" stroke-linecap="round"/>
      <path d="M13 18 Q28 8 34 -6" fill="none" stroke="#6fa06a" stroke-width="6" stroke-linecap="round"/>
    </g>
  </svg>`;
}
