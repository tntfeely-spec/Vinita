import React, { useState } from 'react';
import { Meal } from '../../types';
import MyFitnessPalIcon from '../icons/MyFitnessPalIcon';

interface MyFitnessPalButtonProps {
    meal: Meal;
}

const MyFitnessPalButton: React.FC<MyFitnessPalButtonProps> = ({ meal }) => {
    const [showSuccess, setShowSuccess] = useState(false);

    const handleLogMeal = async () => {
        const { name, macros } = meal;
        
        // Format meal data for clipboard
        const clipboardText = `${name} - ${macros.calories} cal, ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat`;
        
        try {
            // Copy to clipboard
            await navigator.clipboard.writeText(clipboardText);
            
            // Show success message
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            
            // Construct MyFitnessPal Quick Add URL with pre-filled macros
            const mfpUrl = new URL('https://www.myfitnesspal.com/food/quick_add');
            mfpUrl.searchParams.append('calories', macros.calories.toString());
            mfpUrl.searchParams.append('protein', macros.protein.toString());
            mfpUrl.searchParams.append('carbs', macros.carbs.toString());
            mfpUrl.searchParams.append('fat', macros.fat.toString());
            
            // Open MyFitnessPal in new tab with pre-filled data
            window.open(mfpUrl.toString(), '_blank');
            
        } catch (err) {
            // Fallback if clipboard fails
            console.error('Failed to copy to clipboard:', err);
            alert(`Meal copied! Opening MyFitnessPal...\n\nPaste this name: ${name}`);
            
            // Still open MFP even if clipboard fails
            const mfpUrl = new URL('https://www.myfitnesspal.com/food/quick_add');
            mfpUrl.searchParams.append('calories', macros.calories.toString());
            mfpUrl.searchParams.append('protein', macros.protein.toString());
            mfpUrl.searchParams.append('carbs', macros.carbs.toString());
            mfpUrl.searchParams.append('fat', macros.fat.toString());
            window.open(mfpUrl.toString(), '_blank');
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleLogMeal}
                className="bg-[var(--color-accent-his)] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition-opacity duration-200"
            >
                <MyFitnessPalIcon className="w-3 h-3" />
                Log
            </button>
            
            {showSuccess && (
                <div className="absolute top-full right-0 mt-2 bg-green-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10 animate-fade-in">
                    ✓ Copied! Opening MyFitnessPal...
                </div>
            )}
        </div>
    );
};

export default MyFitnessPalButton;
