
import React from 'react';

export const CardsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3.75-3.75M17.25 19.5l-3.75-3.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75h19.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.125 4.5h15.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.036-.84 1.875-1.875 1.875H4.125c-1.036 0-1.875-.84-1.875-1.875V6.375c0-1.036.84-1.875 1.875-1.875z" />
  </svg>
);
