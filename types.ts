export interface Macros {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface Meal {
    name: string;
    description: string;
    macros: Macros;
}

export interface DayPlan {
    day: string;
    meals: {
        her: {
            breakfast: Meal;
            lunch: Meal;
            snack: Meal;
            dinner: Meal;
        };
        his: {
            breakfast: Meal;
            lunch: Meal;
            snack: Meal;
            dinner: Meal;
        };
    };
    workout: string;
}

export interface ShoppingItem {
    id: string;
    name: string;
    quantity: string;
    checked: boolean;
}

export interface ShoppingCategory {
    category: string;
    items: ShoppingItem[];
}

export interface PersonProfile {
    name: string;
    age: number;
    weight: number; // Stored in kg
    height: number; // Stored in cm
    gender: 'male' | 'female';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    goal: 'lose' | 'maintain' | 'gain';
    dailyCalories: number;
    macros: { protein: number; carbs: number; fat: number; };
    dietaryRestrictions: string[];
}

export type ViewFilter = 'her' | 'his' | 'both';

export interface ColorPalette {
    name: string;
    colors: { [key: string]: string };
}

export interface GroceryLink {
    name: string;
    url: string;
    icon: string;
}

export type UnitSystem = 'imperial' | 'metric';

export interface AppSettings {
    unitSystem: UnitSystem;
}