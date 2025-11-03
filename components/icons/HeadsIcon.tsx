
import React from 'react';

export const HeadsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="gambwebHeadsGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
        <stop offset="70%" style={{ stopColor: '#B45309', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#422006', stopOpacity: 1 }} />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#gambwebHeadsGradient)" stroke="#FDE047" strokeWidth="2" />
    <text
      x="50"
      y="68"
      fontFamily="Poppins, sans-serif"
      fontSize="50"
      fontWeight="bold"
      fill="#1E293B"
      textAnchor="middle"
      stroke="#FDE047"
      strokeWidth="1"
      filter="url(#glow)"
    >
      G
    </text>
  </svg>
);