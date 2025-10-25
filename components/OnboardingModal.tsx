import React, { useState, useEffect } from 'react';
import { PersonProfile, AppSettings, UnitSystem } from '../types';
import { DIETARY_RESTRICTIONS } from '../constants';
import { calculateNutritionalProfile, lbsToKg, kgToLbs, cmToFtIn, ftInToCm } from '../utils/calculations';

interface OnboardingModalProps {
    onComplete: (profiles: { her: PersonProfile, his: PersonProfile }) => void;
    initialSettings: AppSettings;
    onSettingsChange: (settings: AppSettings, profiles: { her: PersonProfile, his: PersonProfile }) => void;
}

const defaultProfile: Omit<PersonProfile, 'gender' | 'name'> = {
    age: 30,
    weight: 65, // kg
    height: 165, // cm
    activityLevel: 'light',
    goal: 'maintain',
    dailyCalories: 0,
    macros: { protein: 0, carbs: 0, fat: 0 },
    dietaryRestrictions: [],
};

interface ProfileFormState {
    ft: string;
    in: string;
}

const ProfileStep: React.FC<{ 
    profile: PersonProfile, 
    setProfile: React.Dispatch<React.SetStateAction<PersonProfile>>,
    personKey: 'her' | 'his',
    unitSystem: UnitSystem
}> = ({ profile, setProfile, personKey, unitSystem }) => {
    
    const [height, setHeight] = useState<ProfileFormState>({ ft: '5', in: '5' });

    useEffect(() => {
        if (unitSystem === 'imperial') {
            const { ft, inches } = cmToFtIn(profile.height);
            setHeight({ ft: String(ft), in: String(inches) });
        }
    }, [profile.height, unitSystem]);

    const handleChange = (field: keyof PersonProfile, value: any) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleDietaryChange = (restrictionId: string) => {
        const newRestrictions = profile.dietaryRestrictions.includes(restrictionId)
            ? profile.dietaryRestrictions.filter(id => id !== restrictionId)
            : [...profile.dietaryRestrictions, restrictionId];
        handleChange('dietaryRestrictions', newRestrictions);
    };

    return (
        <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-subtle)]">Name</label>
                    <input type="text" value={profile.name} onChange={e => handleChange('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)]" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-subtle)]">Age</label>
                    <input type="number" value={profile.age} onChange={e => handleChange('age', parseInt(e.target.value) || 0)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)]" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-subtle)]">Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'})</label>
                    <input 
                        type="number" 
                        value={unitSystem === 'imperial' ? kgToLbs(profile.weight) : profile.weight} 
                        onChange={e => handleChange('weight', unitSystem === 'imperial' ? lbsToKg(parseFloat(e.target.value)) : parseFloat(e.target.value) || 0)} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)]" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-subtle)]">Height ({unitSystem === 'imperial' ? 'ft, in' : 'cm'})</label>
                    {unitSystem === 'imperial' ? (
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <input type="number" placeholder="ft" value={height.ft} onChange={e => {
                                const newHeight = { ...height, ft: e.target.value };
                                setHeight(newHeight);
                                handleChange('height', ftInToCm(Number(newHeight.ft), Number(newHeight.in)));
                            }} className="block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)]" />
                            <input type="number" placeholder="in" value={height.in} onChange={e => {
                                const newHeight = { ...height, in: e.target.value };
                                setHeight(newHeight);
                                handleChange('height', ftInToCm(Number(newHeight.ft), Number(newHeight.in)));
                            }} className="block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)]" />
                        </div>
                    ) : (
                        <input type="number" value={profile.height} onChange={e => handleChange('height', parseInt(e.target.value) || 0)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)]" />
                    )}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-subtle)]">Activity Level</label>
                <select value={profile.activityLevel} onChange={e => handleChange('activityLevel', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)]">
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly active</option>
                    <option value="moderate">Moderately active</option>
                    <option value="active">Very active</option>
                    <option value="very_active">Extra active</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-subtle)]">Primary Goal</label>
                <select value={profile.goal} onChange={e => handleChange('goal', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)]">
                    <option value="lose">Weight Loss</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Muscle Gain</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-[var(--color-text-subtle)] mb-2">Dietary Restrictions</label>
                <div className="grid grid-cols-2 gap-2">
                    {DIETARY_RESTRICTIONS.map(r => (
                        <label key={r.id} className="flex items-center">
                            <input type="checkbox" checked={profile.dietaryRestrictions.includes(r.id)} onChange={() => handleDietaryChange(r.id)} className="rounded" />
                            <span className="ml-2 text-sm">{r.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};


const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, initialSettings, onSettingsChange }) => {
    const [step, setStep] = useState(0); // 0: units, 1: her, 2: his
    const [settings, setSettings] = useState(initialSettings);
    const [herProfile, setHerProfile] = useState<PersonProfile>({ ...defaultProfile, gender: 'female', name: 'Her' });
    const [hisProfile, setHisProfile] = useState<PersonProfile>({ ...defaultProfile, gender: 'male', name: 'His', weight: 80, height: 180 });

    const handleComplete = () => {
        const updatedHerProfile = calculateNutritionalProfile(herProfile);
        const updatedHisProfile = calculateNutritionalProfile(hisProfile);
        onSettingsChange(settings, { her: updatedHerProfile, his: updatedHisProfile });
        onComplete({ her: updatedHerProfile, his: updatedHisProfile });
    };

    const titles = ["Measurement Preference", "Tell us about Her", "Tell us about Him"];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-[var(--color-card-bg)] rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
                <div className="p-6 border-b border-[var(--color-button-secondary)]">
                    <h2 className="text-2xl font-bold text-center text-[var(--color-accent-her)]">{titles[step]}</h2>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow">
                   {step === 0 && (
                       <div className="space-y-4">
                           <p className="text-center text-[var(--color-text-subtle)]">First, let's choose your preferred units.</p>
                           <div className="flex justify-center items-center space-x-4 bg-[var(--color-background)] p-4 rounded-lg">
                               <label className="flex items-center cursor-pointer">
                                   <input type="radio" name="unit" value="imperial" checked={settings.unitSystem === 'imperial'} onChange={() => setSettings(s => ({...s, unitSystem: 'imperial'}))} />
                                   <span className="ml-2 font-semibold">Imperial (lbs, ft, in)</span>
                               </label>
                               <label className="flex items-center cursor-pointer">
                                   <input type="radio" name="unit" value="metric" checked={settings.unitSystem === 'metric'} onChange={() => setSettings(s => ({...s, unitSystem: 'metric'}))} />
                                   <span className="ml-2 font-semibold">Metric (kg, cm)</span>
                               </label>
                           </div>
                       </div>
                   )}
                   {step === 1 && <ProfileStep profile={herProfile} setProfile={setHerProfile} personKey="her" unitSystem={settings.unitSystem} />}
                   {step === 2 && <ProfileStep profile={hisProfile} setProfile={setHisProfile} personKey="his" unitSystem={settings.unitSystem} />}
                </div>

                <div className="p-4 bg-[var(--color-background)] border-t border-[var(--color-button-secondary)] flex justify-between gap-4 rounded-b-2xl">
                    <button 
                        onClick={() => setStep(s => Math.max(0, s - 1))}
                        className={`px-6 py-2 rounded-lg bg-[var(--color-button-secondary)] hover:opacity-80 transition-opacity ${step === 0 ? 'invisible' : ''}`}
                    >
                        Back
                    </button>
                     <button 
                        onClick={() => step < 2 ? setStep(s => s + 1) : handleComplete()}
                        className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                        {step < 2 ? 'Next' : 'Generate My Plan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;