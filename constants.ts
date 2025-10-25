import { ColorPalette, GroceryLink } from './types';

export const DIETARY_RESTRICTIONS = [
  { id: 'gluten_free', label: 'Gluten-Free' },
  { id: 'diabetic', label: 'Diabetic Friendly' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'low_carb', label: 'Low-Carb' },
];

export const COLOR_PALETTES: ColorPalette[] = [
    {
        name: 'Vibrant Indigo',
        colors: {
            '--color-primary': '#4f46e5',
            '--color-secondary': '#7c3aed',
            '--color-accent-her': '#ec4899',
            '--color-accent-his': '#22d3ee',
            '--color-background': '#f8fafc',
            '--color-card-bg': '#ffffff',
            '--color-text': '#1e293b',
            '--color-text-subtle': '#64748b',
            '--color-button-secondary': '#e2e8f0',
        },
    },
    {
        name: 'Forest Green',
        colors: {
            '--color-primary': '#166534',
            '--color-secondary': '#15803d',
            '--color-accent-her': '#f97316',
            '--color-accent-his': '#0ea5e9',
            '--color-background': '#f0fdf4',
            '--color-card-bg': '#ffffff',
            '--color-text': '#1e293b',
            '--color-text-subtle': '#475569',
            '--color-button-secondary': '#e2e8f0',
        },
    },
    {
        name: 'Crimson Night',
        colors: {
            '--color-primary': '#dc2626',
            '--color-secondary': '#be123c',
            '--color-accent-her': '#facc15',
            '--color-accent-his': '#67e8f9',
            '--color-background': '#1f2937',
            '--color-card-bg': '#374151',
            '--color-text': '#f9fafb',
            '--color-text-subtle': '#9ca3af',
            '--color-button-secondary': '#4b5563',
        },
    },
];

export const GROCERY_LINKS: GroceryLink[] = [
    { name: 'Instacart', url: 'https://instacart.com', icon: '🛒' },
    { name: 'Whole Foods', url: 'https://www.wholefoodsmarket.com/', icon: '🥦' },
    { name: 'Walmart', url: 'https://walmart.com/grocery', icon: '🏪' },
    { name: 'Thrive Market', url: 'https://thrivemarket.com', icon: '🌱' },
    { name: 'Safeway', url: 'https://www.safeway.com/', icon: '🍎' },
    { name: 'Costco', url: 'https://www.costco.com/grocery-household.html', icon: '📦' },
];