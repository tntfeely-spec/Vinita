import React from 'react';
import { Meal } from '../types';
import SwapIcon from './icons/SwapIcon';
import MyFitnessPalButton from './integrations/MyFitnessPalButton';

interface MealCardProps {
    person: 'her' | 'his';
    meal: Meal;
    onSwap: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ person, meal, onSwap }) => {
    const accentColor = person === 'her' ? 'var(--color-accent-her)' : 'var(--color-accent-his)';

    return (
        <div className="bg-[var(--color-card-bg)] rounded-2xl shadow-md p-5 flex flex-col transition-shadow hover:shadow-lg h-full">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-xl" style={{ color: accentColor }}>
                    {person === 'her' ? "Her" : "His"}
                </h3>
                <button 
                    onClick={onSwap}
                    className="flex items-center gap-1 text-sm text-[var(--color-text-subtle)] hover:text-[var(--color-primary)] transition-colors"
                >
                    <SwapIcon className="w-4 h-4" /> Swap
                </button>
            </div>
            
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg text-[var(--color-text)]">{meal.name}</h4>
                    <MyFitnessPalButton meal={meal} />
                </div>
                <p className="text-[var(--color-text-subtle)] text-sm whitespace-pre-line mb-4">{meal.description}</p>
            </div>
            
            <div className="bg-[var(--color-background)] p-3 rounded-md mt-auto">
                <div className="grid grid-cols-4 text-center text-xs">
                    <div>
                        <div className="font-bold text-base text-[var(--color-primary)]">{meal.macros.calories}</div>
                        <div className="text-[var(--color-text-subtle)]">Calories</div>
                    </div>
                     <div>
                        <div className="font-bold text-base text-[var(--color-primary)]">{meal.macros.protein}g</div>
                        <div className="text-[var(--color-text-subtle)]">Protein</div>
                    </div>
                     <div>
                        <div className="font-bold text-base text-[var(--color-primary)]">{meal.macros.carbs}g</div>
                        <div className="text-[var(--color-text-subtle)]">Carbs</div>
                    </div>
                     <div>
                        <div className="font-bold text-base text-[var(--color-primary)]">{meal.macros.fat}g</div>
                        <div className="text-[var(--color-text-subtle)]">Fat</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealCard;
