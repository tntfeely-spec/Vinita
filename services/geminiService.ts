import { GoogleGenAI, Type } from "@google/genai";
import { PersonProfile, Meal, DayPlan, ShoppingCategory } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const mealSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the meal." },
        description: { type: Type.STRING, description: "A short, appealing description of the meal, including main ingredients. Use newline characters for lists." },
        macros: {
            type: Type.OBJECT,
            properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
            },
            required: ['calories', 'protein', 'carbs', 'fat']
        }
    },
    required: ['name', 'description', 'macros']
};

const dayPlanSchema = {
    type: Type.OBJECT,
    properties: {
        day: { type: Type.STRING },
        meals: {
            type: Type.OBJECT,
            properties: {
                her: {
                    type: Type.OBJECT,
                    properties: {
                        breakfast: mealSchema,
                        lunch: mealSchema,
                        snack: mealSchema,
                        dinner: mealSchema
                    },
                    required: ['breakfast', 'lunch', 'snack', 'dinner']
                },
                his: {
                    type: Type.OBJECT,
                    properties: {
                        breakfast: mealSchema,
                        lunch: mealSchema,
                        snack: mealSchema,
                        dinner: mealSchema
                    },
                    required: ['breakfast', 'lunch', 'snack', 'dinner']
                }
            },
            required: ['her', 'his']
        },
        workout: { type: Type.STRING, description: "A suggested workout for the day, e.g., 'Tonal Upper Body Strength' or 'Peloton 30-min ride'." }
    },
    required: ['day', 'meals', 'workout']
};

const fullPlanSchema = {
    type: Type.OBJECT,
    properties: {
        weekPlan: {
            type: Type.ARRAY,
            description: "A 7-day meal plan.",
            items: dayPlanSchema
        },
        shoppingList: {
            type: Type.ARRAY,
            description: "A consolidated shopping list for the entire week.",
            items: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING, description: "e.g., Produce, Dairy, Meat, Pantry" },
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                quantity: { type: Type.STRING, description: "e.g., '2 lbs' or '1 container'" }
                            },
                            required: ['name', 'quantity']
                        }
                    }
                },
                required: ['category', 'items']
            }
        },
        tips: {
            type: Type.ARRAY,
            description: "3-5 general success tips for meal prepping and staying on track.",
            items: { type: Type.STRING }
        }
    },
    required: ['weekPlan', 'shoppingList', 'tips']
};


export const generateWeeklyPlan = async (
    herProfile: PersonProfile,
    hisProfile: PersonProfile
): Promise<{ weekPlan: DayPlan[], shoppingList: ShoppingCategory[], tips: string[] }> => {
    
    const prompt = `
Create a comprehensive 7-day meal plan for a couple, "Her" and "His", based on their profiles. The goal is to provide meals they can often cook together, but portioned differently to meet their individual nutritional needs.

**Her Profile:**
- Goal: ${herProfile.goal}
- Daily Calories: ~${herProfile.dailyCalories} kcal
- Macros: Protein ~${herProfile.macros.protein}g, Carbs ~${herProfile.macros.carbs}g, Fat ~${herProfile.macros.fat}g
- Dietary Restrictions: ${herProfile.dietaryRestrictions.join(', ') || 'None'}

**His Profile:**
- Goal: ${hisProfile.goal}
- Daily Calories: ~${hisProfile.dailyCalories} kcal
- Macros: Protein ~${hisProfile.macros.protein}g, Carbs ~${hisProfile.macros.carbs}g, Fat ~${hisProfile.macros.fat}g
- Dietary Restrictions: ${hisProfile.dietaryRestrictions.join(', ') || 'None'}

**Instructions:**
1.  **Variety:** Provide a varied and appealing menu for the week (Monday to Sunday).
2.  **Shared Meals:** Meals should be similar for both, with adjustments in portion sizes or small additions/subtractions to meet macro targets. For example, "His" portion might have extra rice or protein. The meal description should reflect this.
3.  **Accuracy:** Ensure the total daily macros for each person are as close as possible to their targets.
4.  **Shopping List:** Create a consolidated shopping list, categorized for easy shopping.
5.  **Tips:** Provide a few actionable tips for success.
6.  **Workouts:** Suggest a realistic workout for each day, alternating between activities like Tonal, Peloton, Pickleball, or Rest.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: fullPlanSchema,
                // Fix: Corrected temperature to a valid value between 0 and 1.
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        
        // Add unique IDs to shopping list items
        const shoppingListWithIds = data.shoppingList.map((category: any) => ({
            ...category,
            items: category.items.map((item: any) => ({
                ...item,
                id: `${category.category}-${item.name}-${Math.random()}`,
                checked: false,
            }))
        }));

        return { ...data, shoppingList: shoppingListWithIds };

    } catch (error) {
        console.error("Error generating weekly plan:", error);
        throw new Error("Failed to generate meal plan. The model might be overloaded. Please try again later.");
    }
};

export const getMealAlternatives = async (
    profile: PersonProfile,
    mealType: string,
    originalMeal: Meal
): Promise<Meal[]> => {
    const prompt = `
Generate 3 alternative ${mealType} options for a person with the following profile:
- Goal: ${profile.goal}
- Daily Calories: ~${profile.dailyCalories} kcal
- Target ${mealType} macros: ~${Math.round(originalMeal.macros.calories)} kcal, P:${Math.round(originalMeal.macros.protein)}g, C:${Math.round(originalMeal.macros.carbs)}g, F:${Math.round(originalMeal.macros.fat)}g
- Dietary Restrictions: ${profile.dietaryRestrictions.join(', ') || 'None'}

The original meal was "${originalMeal.name}". The alternatives should be different but nutritionally similar.
`;

    const alternativesSchema = {
        type: Type.ARRAY,
        items: mealSchema
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: alternativesSchema,
                temperature: 0.8,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error fetching meal alternatives:", error);
        throw new Error("Failed to fetch alternatives.");
    }
};
