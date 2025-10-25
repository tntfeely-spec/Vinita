import React, { useState, useRef, useEffect } from 'react';
import { ColorPalette } from '../types';

interface ColorPaletteSelectorProps {
    palettes: ColorPalette[];
    onPaletteChange: (palette: ColorPalette) => void;
}

const ColorPaletteSelector: React.FC<ColorPaletteSelectorProps> = ({ palettes, onPaletteChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelect = (palette: ColorPalette) => {
        onPaletteChange(palette);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[var(--color-background)] text-[var(--color-text)] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-[var(--color-button-secondary)] transition-colors duration-200"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                Theme
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--color-card-bg)] rounded-md shadow-lg z-20 border border-[var(--color-button-secondary)]">
                    <ul className="py-1">
                        {palettes.map(palette => (
                            <li
                                key={palette.name}
                                onClick={() => handleSelect(palette)}
                                className="px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-background)] cursor-pointer flex items-center justify-between"
                            >
                                <span>{palette.name}</span>
                                <div className="flex gap-1">
                                    {Object.values(palette.colors).slice(0, 4).map((color, i) => (
                                        <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ColorPaletteSelector;