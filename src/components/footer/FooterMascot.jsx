export default function FooterMascot() {
  return (
    <svg
      className="footer-mascot"
      viewBox="0 0 1440 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Black background */}
      <rect width="1440" height="400" fill="#0a0a0a" />

      {/* Orange flame layer - exact curves from reference */}
      <g fill="#e8542a">
        {/* Far left flame - tall curling flame */}
        <path d="M0 400 L0 280 C5 270 15 240 30 260 C25 220 40 170 65 200 C55 160 70 110 100 140 C90 100 110 60 145 85 C135 50 160 30 190 55 C185 35 200 15 220 30 C230 10 255 25 265 50 C280 20 310 35 320 65 C335 45 355 70 365 100 C380 80 400 110 410 140 L420 400 Z" />

        {/* Left-center flames around character */}
        <path d="M420 400 L420 260 C430 240 435 220 445 235 C440 200 455 170 475 195 C470 165 485 140 505 165 C500 140 515 115 535 140 C530 120 550 105 565 125 L590 400 Z" />

        {/* Center-left small flames */}
        <path d="M590 400 L590 290 C600 270 610 255 620 270 C625 250 640 235 655 255 C660 240 675 225 690 245 L700 400 Z" />

        {/* Center-right small flames */}
        <path d="M760 400 L760 290 C770 270 780 255 790 270 C795 250 810 235 825 255 C830 240 845 225 860 245 L870 400 Z" />

        {/* Right-center flames around character */}
        <path d="M870 400 L870 260 C880 240 885 220 895 235 C890 200 905 170 925 195 C920 165 935 140 955 165 C950 140 965 115 985 140 C980 120 1000 105 1015 125 L1040 400 Z" />

        {/* Far right flames - tall curling flame */}
        <path d="M1040 400 L1040 140 C1055 110 1075 80 1090 100 C1085 65 1100 45 1120 65 C1115 40 1135 25 1155 45 C1150 25 1170 15 1190 30 C1195 10 1215 20 1225 45 C1235 25 1255 30 1265 55 C1280 35 1305 50 1315 80 C1330 60 1355 80 1365 110 C1380 90 1405 120 1415 150 C1425 130 1435 160 1440 180 L1440 400 Z" />
      </g>

      {/* Character mascot - centered, peeking from flames */}
      <g>
        {/* Two squiggly antenna/hair lines rising from head */}
        <g fill="none" stroke="#e8542a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          {/* Left antenna - squiggly line going up-left */}
          <path d="M650 285 C640 265 625 250 620 230 C615 210 625 195 635 200 C645 205 650 220 645 235 C640 250 620 245 615 230 C610 215 620 195 635 190 C645 187 650 200 645 215" />

          {/* Right antenna - squiggly line going up-right to exclamation */}
          <path d="M810 285 C820 265 835 250 840 230 C845 210 835 195 825 200 C815 205 810 220 815 235 C820 250 840 245 845 230 C850 215 840 195 825 190" />
        </g>

        {/* Circle connector at top of right antenna */}
        <circle cx="825" cy="185" r="8" fill="none" stroke="#e8542a" strokeWidth="4.5" />

        {/* Exclamation mark shape (trapezoid) at top */}
        <path
          d="M810 175 L800 120 L850 120 L840 175 Z"
          fill="none"
          stroke="#e8542a"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* Happy closed eyes - curved arcs */}
        <g fill="none" stroke="#0a0a0a" strokeWidth="4" strokeLinecap="round">
          <path d="M670 335 C680 325 700 325 710 335" />
          <path d="M745 335 C755 325 775 325 785 335" />
        </g>

        {/* Little rectangular paws/hands sticking up from orange base */}
        <rect x="610" y="365" width="35" height="22" rx="4" fill="#0a0a0a" />
        <rect x="795" y="365" width="35" height="22" rx="4" fill="#0a0a0a" />
      </g>
    </svg>
  )
}
