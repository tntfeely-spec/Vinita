import React, { useState, useEffect, useCallback } from 'react';
import { DayPlan, PersonProfile, ViewFilter, ShoppingCategory, Meal, ColorPalette, AppSettings } from './types';
import { generateWeeklyPlan } from './services/geminiService';
import { COLOR_PALETTES, GROCERY_LINKS } from './constants';
import Header from './components/Header';
import DaySelector from './components/DaySelector';
import Overview from './components/Overview';
import DaySection from './components/DaySection';
import ShoppingList from './components/ShoppingList';
import GroceryLinks from './components/GroceryLinks';
import TipsSection from './components/TipsSection';
import SettingsModal from './components/SettingsModal';
import OnboardingModal from './components/OnboardingModal';

const App: React.FC = () => {
    const [weekPlan, setWeekPlan] = useState<DayPlan[]>([]);
    const [shoppingList, setShoppingList] = useState<ShoppingCategory[]>([]);
    const [tips, setTips] = useState<string[]>([]);
    
    const [profiles, setProfiles] = useState<{ her: PersonProfile, his: PersonProfile } | null>(null);
    const [settings, setSettings] = useState<AppSettings>({ unitSystem: 'imperial' });

    const [selectedDay, setSelectedDay] = useState<string>('Monday');
    const [selectedFilter, setSelectedFilter] = useState<ViewFilter>('both');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

    const applyColorPalette = (palette: ColorPalette) => {
        const root = document.documentElement;
        Object.entries(palette.colors).forEach(([key, value]) => {
            root.style.setProperty(key, String(value));
        });
        localStorage.setItem('colorPalette', palette.name);
    };

    useEffect(() => {
        // Load settings first
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }

        const savedPaletteName = localStorage.getItem('colorPalette');
        const savedPalette = COLOR_PALETTES.find(p => p.name === savedPaletteName) || COLOR_PALETTES[0];
        applyColorPalette(savedPalette);

        const savedProfiles = localStorage.getItem('userProfiles');
        if (savedProfiles) {
            setProfiles(JSON.parse(savedProfiles));
        } else {
            setIsOnboardingOpen(true);
        }
    }, []);

    const fetchPlan = useCallback(async (currentProfiles: { her: PersonProfile, his: PersonProfile }) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await generateWeeklyPlan(currentProfiles.her, currentProfiles.his);
            setWeekPlan(data.weekPlan);
            setShoppingList(data.shoppingList);
            setTips(data.tips);
            
            const today = new Date().toLocaleString('en-us', { weekday: 'long' });
            const todayPlanExists = data.weekPlan.some(d => d.day === today);
            setSelectedDay(todayPlanExists ? today : (data.weekPlan[0]?.day || 'Monday'));
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (profiles) {
            fetchPlan(profiles);
        }
    }, [profiles, fetchPlan]);
    
    const handleProfilesSave = (newProfiles: { her: PersonProfile, his: PersonProfile }) => {
        setProfiles(newProfiles);
        localStorage.setItem('userProfiles', JSON.stringify(newProfiles));
        setIsOnboardingOpen(false); // Close onboarding after saving
    };

    const handleSettingsSave = (newSettings: AppSettings, newProfiles: { her: PersonProfile, his: PersonProfile }) => {
        setSettings(newSettings);
        localStorage.setItem('appSettings', JSON.stringify(newSettings));
        handleProfilesSave(newProfiles);
    };

    const handleMealSwap = (day: string, person: 'her' | 'his', mealType: keyof DayPlan['meals']['her'], newMeal: Meal) => {
        setWeekPlan(prevPlan => {
            return prevPlan.map(dayPlan => {
                if (dayPlan.day === day) {
                    const newDayPlan = { ...dayPlan };
                    newDayPlan.meals[person][mealType] = newMeal;
                    return newDayPlan;
                }
                return dayPlan;
            });
        });
    };

    const handleToggleShoppingItem = (categoryName: string, itemId: string) => {
        setShoppingList(prevList => {
            return prevList.map(category => {
                if (category.category === categoryName) {
                    return {
                        ...category,
                        items: category.items.map(item =>
                            item.id === itemId ? { ...item, checked: !item.checked } : item
                        ),
                    };
                }
                return category;
            });
        });
    };

    const currentDayPlan = weekPlan.find(d => d.day === selectedDay);

    if (isOnboardingOpen) {
         return <OnboardingModal onComplete={handleProfilesSave} initialSettings={settings} onSettingsChange={handleSettingsSave} />;
    }

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)] min-h-screen font-sans">
            {profiles && (
                <SettingsModal 
                    isOpen={isSettingsOpen} 
                    onClose={() => setIsSettingsOpen(false)} 
                    onSave={handleSettingsSave}
                    initialProfiles={profiles}
                    initialSettings={settings}
                />
            )}
            
            <Header
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                palettes={COLOR_PALETTES}
                onPaletteChange={applyColorPalette}
                onOpenSettings={() => setIsSettingsOpen(true)}
            />

            <main className="container mx-auto px-4 sm:px-6 pb-12">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-primary)]"></div>
                        <p className="mt-6 text-lg text-[var(--color-text-subtle)]">Generating your personalized weekly plan...</p>
                        <p className="text-sm text-[var(--color-text-subtle)]">This might take a moment.</p>
                    </div>
                )}
                
                {error && !isLoading && (
                     <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl" role="alert">
                        <strong className="font-bold">Oh no! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {!isLoading && !error && weekPlan.length > 0 && profiles && currentDayPlan && (
                    <>
                        <DaySelector days={weekPlan.map(d => d.day)} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
                        <Overview dayPlan={currentDayPlan} profiles={profiles} viewFilter={selectedFilter} />
                        <DaySection dayPlan={currentDayPlan} profiles={profiles} onMealSwap={handleMealSwap} viewFilter={selectedFilter} />
                        <ShoppingList categories={shoppingList} onToggleItem={handleToggleShoppingItem} />
                        <GroceryLinks links={GROCERY_LINKS} />
                        <TipsSection tips={tips} />
                    </>
                )}
            </main>
        </div>
    );
};

export default App;