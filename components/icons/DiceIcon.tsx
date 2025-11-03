
import React from 'react';

export const DiceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0-2.25l2.25 1.313M12 12.75l-2.25 1.313M3 16.5l2.25-1.313M21 16.5l-2.25-1.313m-16.5 0l2.25 1.313M21 16.5l-2.25 1.313m-16.5 0v-2.25m2.25 2.25l-2.25-1.313M18.75 16.5l-2.25-1.313" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-5.223a.75.75 0 01.792 0l8.954 5.223m-1.556 4.319l-7.398 4.315a.75.75 0 01-.792 0l-7.398-4.315M3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12z" />
  </svg>
);
