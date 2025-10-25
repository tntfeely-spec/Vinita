import React from 'react';
import { DayPlan, PersonProfile, Macros, ViewFilter } from '../types';

interface OverviewProps {
    dayPlan: DayPlan;
    profiles: { [key: string]: PersonProfile };
    viewFilter: ViewFilter;
}

const calculateTotalMacros = (meals: DayPlan['meals']['her']): Macros => {
    const mealList = [meals.breakfast, meals.lunch, meals.snack, meals.dinner];
    return mealList.reduce((acc, meal) => {
        acc.calories += meal.macros.calories;
        acc.protein += meal.macros.protein;
        acc.carbs += meal.macros.carbs;
        acc.fat += meal.macros.fat;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
};

const MacroBar: React.FC<{ value: number; max: number; color: string }> = ({ value, max, color }) => {
    const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="w-full bg-[var(--color-background)] rounded-full h-2.5">
            <div
                className="h-2.5 rounded-full"
                style={{ width: `${percentage}%`, backgroundColor: color }}
            ></div>
        </div>
    );
};

const ProfileOverview: React.FC<{ person: 'her' | 'his', profile: PersonProfile, macros: Macros }> = ({ person, profile, macros }) => {
    const accentColor = person === 'her' ? 'var(--color-accent-her)' : 'var(--color-accent-his)';
    
    return (
        <div className="bg-[var(--color-card-bg)] p-6 rounded-2xl shadow-md flex-1">
            <h3 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>{profile.name}'s Daily Summary</h3>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="font-semibold">Calories</span>
                        <span className="text-sm text-[var(--color-text-subtle)]">{macros.calories.toFixed(0)} / {profile.dailyCalories} kcal</span>
                    </div>
                    <MacroBar value={macros.calories} max={profile.dailyCalories} color={accentColor} />
                </div>
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="font-semibold">Protein</span>
                        <span className="text-sm text-[var(--color-text-subtle)]">{macros.protein.toFixed(0)} / {profile.macros.protein} g</span>
                    </div>
                    <MacroBar value={macros.protein} max={profile.macros.protein} color={accentColor} />
                </div>
                 <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="font-semibold">Carbs</span>
                        <span className="text-sm text-[var(--color-text-subtle)]">{macros.carbs.toFixed(0)} / {profile.macros.carbs} g</span>
                    </div>
                    <MacroBar value={macros.carbs} max={profile.macros.carbs} color={accentColor} />
                </div>
                 <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="font-semibold">Fat</span>
                        <span className="text-sm text-[var(--color-text-subtle)]">{macros.fat.toFixed(0)} / {profile.macros.fat} g</span>
                    </div>
                    <MacroBar value={macros.fat} max={profile.macros.fat} color={accentColor} />
                </div>
            </div>
        </div>
    );
};


const Overview: React.FC<OverviewProps> = ({ dayPlan, profiles, viewFilter }) => {
    const herMacros = calculateTotalMacros(dayPlan.meals.her);
    const hisMacros = calculateTotalMacros(dayPlan.meals.his);

    const showHer = viewFilter === 'her' || viewFilter === 'both';
    const showHis = viewFilter === 'his' || viewFilter === 'both';

    return (
        <div className="mb-8">
            <div className={`grid grid-cols-1 ${showHer && showHis ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6`}>
                {showHer && <ProfileOverview person="her" profile={profiles.her} macros={herMacros} />}
                {showHis && <ProfileOverview person="his" profile={profiles.his} macros={hisMacros} />}
            </div>
        </div>
    );
};

export default Overview;