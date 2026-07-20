import React from 'react';

export default function TrackMap({ circuitName, className }) {
    // Normalize string to match keys easily
    const name = (circuitName || '').toLowerCase();

    // Actual minimalist SVG paths for iconic circuits
    let pathData = "M20 50 C 20 20, 80 20, 80 50 C 80 80, 20 80, 20 50 Z"; // Generic fallback loop
    let viewBox = "0 0 100 100";

    if (name.includes('monza')) {
        // Monza (The Temple of Speed - straights and chicanes)
        pathData = "M 30,80 L 30,30 C 30,15 45,15 50,30 L 50,70 C 55,85 70,85 70,70 L 70,20 C 85,20 85,80 70,80 Z";
        viewBox = "0 0 100 100";
    } else if (name.includes('silverstone')) {
        // Silverstone style sweepers
        pathData = "M 20,70 Q 20,30 50,30 T 80,50 Q 80,80 50,80 T 20,70 Z";
        viewBox = "0 0 100 100";
    } else if (name.includes('monaco')) {
        // Monaco hairpin & harbor layout
        pathData = "M 40,80 C 20,80 15,50 30,40 C 45,30 40,15 60,15 C 80,15 85,40 70,55 C 55,70 60,80 40,80 Z";
        viewBox = "0 0 100 100";
    } else if (name.includes('spa') || name.includes('belgium')) {
        // Spa-Francorchamps (Eau Rouge profile approximation)
        pathData = "M 20,80 L 40,60 L 40,30 L 70,20 L 80,50 L 50,70 Z";
        viewBox = "0 0 100 100";
    }

    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d={pathData} />
        </svg>
    );
}