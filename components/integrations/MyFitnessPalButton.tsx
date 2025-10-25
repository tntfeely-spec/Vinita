import React from 'react';
import { Meal } from '../../types';
import MyFitnessPalIcon from '../icons/MyFitnessPalIcon';

interface MyFitnessPalButtonProps {
    meal: Meal;
}

const MyFitnessPalButton: React.FC<MyFitnessPalButtonProps> = ({ meal }) => {

    const handleLogMeal = () => {
        const { name, macros } = meal;
        const message = `(Simulation) Meal Logged to MyFitnessPal:
- Name: ${name}
- Calories: ${macros.calories}
- Protein: ${macros.protein}g
- Carbs: ${macros.carbs}g
- Fat: ${macros.fat}g`;
        alert(message);
    };

    return (
        <button
            onClick={handleLogMeal}
            className="bg-[var(--color-accent-his)] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition-opacity duration-200"
        >
            <MyFitnessPalIcon className="w-3 h-3" />
            Log
        </button>
    );
};

export default MyFitnessPalButton;