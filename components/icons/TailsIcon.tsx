
import React from 'react';

export const TailsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="gambwebTailsGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
        <stop offset="70%" style={{ stopColor: '#B45309', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#422006', stopOpacity: 1 }} />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#gambwebTailsGradient)" stroke="#FDE047" strokeWidth="2" />
    <path
      d="M50 25 C 65 35, 65 65, 50 75 S 35 65, 35 35 C 35 30, 40 25, 50 25 Z"
      fill="none"
      stroke="#FDE047"
      strokeWidth="3"
      transform="rotate(45 50 50)"
    />
    <circle cx="50" cy="50" r="10" fill="none" stroke="#FDE047" strokeWidth="3" />
  </svg>
);