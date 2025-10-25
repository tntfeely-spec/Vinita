
import React, { useState, useEffect } from 'react';
import { Meal, PersonProfile } from '../types';
import { getMealAlternatives } from '../services/geminiService';

interface SwapModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmSwap: (newMeal: Meal) => void;
    profile: PersonProfile;
    mealType: string;
    originalMeal: Meal;
}

const SwapModal: React.FC<SwapModalProps> = ({ isOpen, onClose, onConfirmSwap, profile, mealType, originalMeal }) => {
    const [alternatives, setAlternatives] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlternative, setSelectedAlternative] = useState<Meal | null>(null);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setAlternatives([]);
            setSelectedAlternative(null);
            
            getMealAlternatives(profile, mealType, originalMeal)
                .then(data => {
                    setAlternatives(data);
                })
                .catch(error => {
                    console.error("Failed to fetch meal alternatives:", error);
                    // You might want to show an error message to the user here
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isOpen, profile, mealType, originalMeal]);
    
    if (!isOpen) {
        return null;
    }

    const handleSelect = (meal: Meal) => {
        setSelectedAlternative(meal);
    };

    const handleConfirm = () => {
        if (selectedAlternative) {
            onConfirmSwap(selectedAlternative);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-[var(--color-card-bg)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-[var(--color-button-secondary)]">
                    <h2 className="text-2xl font-bold text-center">Swap {mealType}</h2>
                    <p className="text-center text-[var(--color-text-subtle)]">Original: {originalMeal.name}</p>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
                            <p className="mt-4 text-[var(--color-text-subtle)]">Finding tasty alternatives...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {alternatives.length > 0 ? (
                                alternatives.map((alt, index) => (
                                    <div 
                                        key={index} 
                                        onClick={() => handleSelect(alt)}
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAlternative?.name === alt.name ? 'border-[var(--color-primary)] bg-[var(--color-background)]' : 'border-[var(--color-button-secondary)] hover:border-[var(--color-secondary)]'}`}
                                    >
                                        <h4 className="font-bold text-lg">{alt.name}</h4>
                                        <p className="text-sm text-[var(--color-text-subtle)] whitespace-pre-line">{alt.description}</p>
                                        <div className="text-xs grid grid-cols-4 gap-2 mt-2 text-center">
                                            <span>{alt.macros.calories} kcal</span>
                                            <span>{alt.macros.protein}g P</span>
                                            <span>{alt.macros.carbs}g C</span>
                                            <span>{alt.macros.fat}g F</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-[var(--color-text-subtle)]">Could not find any alternatives. Please try again later.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-[var(--color-background)] border-t border-[var(--color-button-secondary)] flex justify-end gap-4 rounded-b-2xl">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-[var(--color-button-secondary)] hover:opacity-80 transition-opacity">
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={!selectedAlternative || loading}
                        className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        Confirm Swap
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SwapModal;
