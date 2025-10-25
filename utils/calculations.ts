import { PersonProfile } from '../types';

// Unit Conversion
export const lbsToKg = (lbs: number): number => lbs * 0.453592;
export const kgToLbs = (kg: number): number => Math.round(kg / 0.453592);

export const ftInToCm = (ft: number, inches: number): number => (ft * 30.48) + (inches * 2.54);
export const cmToFtIn = (cm: number): { ft: number, inches: number } => {
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { ft, inches };
};

// Harris-Benedict Equation for BMR
const calculateBMR = (profile: Omit<PersonProfile, 'dailyCalories' | 'macros' | 'dietaryRestrictions' | 'name'>): number => {
    const { weight, height, age, gender } = profile;
    if (gender === 'male') {
        // Note: Using kg for weight and cm for height
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
};

const activityMultipliers: { [key in PersonProfile['activityLevel']]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
};

const goalAdjustments: { [key in PersonProfile['goal']]: number } = {
    lose: -400, // Calorie deficit
    maintain: 0,
    gain: 400,   // Calorie surplus
};

// Calculate TDEE (Total Daily Energy Expenditure)
const calculateTDEE = (bmr: number, activityLevel: PersonProfile['activityLevel']): number => {
    return bmr * activityMultipliers[activityLevel];
};

// Calculate macros based on calorie goal (e.g., 40% protein, 30% carbs, 30% fat)
const calculateMacros = (calories: number): { protein: number; carbs: number; fat: number } => {
    const protein = Math.round((calories * 0.40) / 4); // 4 kcal per gram
    const carbs = Math.round((calories * 0.30) / 4);   // 4 kcal per gram
    const fat = Math.round((calories * 0.30) / 9);     // 9 kcal per gram
    return { protein, carbs, fat };
};

export const calculateNutritionalProfile = (
    profile: Omit<PersonProfile, 'dailyCalories' | 'macros'>
): PersonProfile => {
    const bmr = calculateBMR(profile);
    const tdee = calculateTDEE(bmr, profile.activityLevel);
    const dailyCalories = Math.round(tdee + goalAdjustments[profile.goal]);
    const macros = calculateMacros(dailyCalories);

    return {
        ...profile,
        dailyCalories,
        macros,
    };
};
