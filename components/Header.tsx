import React from 'react';
import { ViewFilter, ColorPalette } from '../types';
import VINITALogo from './icons/VINITALogo';
import ProfileSelector from './ProfileSelector';
import ColorPaletteSelector from './ColorPaletteSelector';
import SettingsIcon from './icons/SettingsIcon';

interface HeaderProps {
    selectedFilter: ViewFilter;
    onFilterChange: (filter: ViewFilter) => void;
    palettes: ColorPalette[];
    onPaletteChange: (palette: ColorPalette) => void;
    onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedFilter, onFilterChange, palettes, onPaletteChange, onOpenSettings }) => {
    return (
        <header className="bg-[var(--color-card-bg)] p-4 sm:p-6 rounded-b-3xl mb-8 shadow-lg border-b-2 border-[var(--color-button-secondary)]">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <VINITALogo className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--color-primary)]" />
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">V.I.N.I.T.A.</h1>
                            <p className="text-xs text-[var(--color-text-subtle)] hidden sm:block">Vision, Intention, Nutrition, Inspiration, Training, Action</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                         <ColorPaletteSelector palettes={palettes} onPaletteChange={onPaletteChange} />
                         <button 
                            onClick={onOpenSettings} 
                            className="bg-[var(--color-background)] text-[var(--color-text)] p-2 rounded-full hover:bg-[var(--color-button-secondary)] transition-colors"
                            aria-label="Open settings"
                         >
                            <SettingsIcon className="w-5 h-5" />
                         </button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <ProfileSelector selectedFilter={selectedFilter} onFilterChange={onFilterChange} />
                </div>
            </div>
        </header>
    );
};

export default Header;