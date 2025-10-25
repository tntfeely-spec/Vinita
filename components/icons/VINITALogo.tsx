import React from 'react';

const VINITALogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 24" fill="currentColor" {...props}>
        <text
            x="0"
            y="18"
            fontFamily="sans-serif"
            fontSize="24"
            fontWeight="bold"
            letterSpacing="2"
        >
            V.I.N.I.T.A.
        </text>
    </svg>
);

export default VINITALogo;
