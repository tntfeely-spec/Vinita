import React, { useState } from 'react';
import { DayPlan, PersonProfile, Meal, ViewFilter } from '../types';
import MealCard from './MealCard';
import WorkoutIntegration from './integrations/WorkoutIntegration';
import CalendarIntegration from './integrations/CalendarIntegration';
import SwapModal from './SwapModal';

interface DaySectionProps {
    dayPlan: DayPlan;
    profiles: { [key: string]: PersonProfile };
    onMealSwap: (day: string, person: 'her' | 'his', mealType: keyof DayPlan['meals']['her'], newMeal: Meal) => void;
    viewFilter: ViewFilter;
}

const mealTypes: (keyof DayPlan['meals']['her'])[] = ['breakfast', 'lunch', 'snack', 'dinner'];

const DaySection: React.FC<DaySectionProps> = ({ dayPlan, profiles, onMealSwap, viewFilter }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [swapInfo, setSwapInfo] = useState<{
        person: 'her' | 'his';
        mealType: keyof DayPlan['meals']['her'];
        originalMeal: Meal;
    } | null>(null);

    const handleOpenModal = (person: 'her' | 'his', mealType: keyof DayPlan['meals']['her'], originalMeal: Meal) => {
        setSwapInfo({ person, mealType, originalMeal });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSwapInfo(null);
    };
    
    const handleConfirmSwap = (newMeal: Meal) => {
        if (swapInfo) {
            onMealSwap(dayPlan.day, swapInfo.person, swapInfo.mealType, newMeal);
        }
        handleCloseModal();
    };

    const showHer = viewFilter === 'her' || viewFilter === 'both';
    const showHis = viewFilter === 'his' || viewFilter === 'both';
    const gridCols = showHer && showHis ? 'lg:grid-cols-2' : 'lg:grid-cols-1';

    return (
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="mb-2 sm:mb-0">
                    <h2 className="text-3xl font-bold text-[var(--color-text)]">{dayPlan.day}'s Plan</h2>
                    <p className="text-[var(--color-text-subtle)]">
                        Workout: <WorkoutIntegration workout={dayPlan.workout} />
                    </p>
                </div>
                <CalendarIntegration dayPlan={dayPlan} />
            </div>

            <div className="space-y-8">
                {mealTypes.map(mealType => (
                    <div key={mealType}>
                        <h3 className="text-xl font-bold mb-4 capitalize text-[var(--color-text-subtle)] border-b-2 border-[var(--color-card-bg)] pb-2">{mealType}</h3>
                        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
                            {showHer && (
                                <MealCard 
                                    person="her" 
                                    meal={dayPlan.meals.her[mealType]} 
                                    onSwap={() => handleOpenModal('her', mealType, dayPlan.meals.her[mealType])} 
                                />
                            )}
                            {showHis && (
                                <MealCard 
                                    person="his" 
                                    meal={dayPlan.meals.his[mealType]} 
                                    onSwap={() => handleOpenModal('his', mealType, dayPlan.meals.his[mealType])} 
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            {isModalOpen && swapInfo && (
                <SwapModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirmSwap={handleConfirmSwap}
                    profile={profiles[swapInfo.person]}
                    mealType={swapInfo.mealType}
                    originalMeal={swapInfo.originalMeal}
                />
            )}
        </div>
    );
};

export default DaySection;
