import React, { useState, useEffect } from 'react';
import { PersonProfile, AppSettings, UnitSystem } from '../types';
import { calculateNutritionalProfile, lbsToKg, kgToLbs, cmToFtIn, ftInToCm } from '../utils/calculations';
import { DIETARY_RESTRICTIONS } from '../constants';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (settings: AppSettings, profiles: { her: PersonProfile, his: PersonProfile }) => void;
    initialProfiles: { her: PersonProfile, his: PersonProfile };
    initialSettings: AppSettings;
}

interface ProfileFormState {
    ft: string;
    in: string;
}

const ProfileEditor: React.FC<{ 
    profile: PersonProfile, 
    onChange: (field: keyof PersonProfile | 'ft' | 'in', value: any) => void, 
    personKey: 'her' | 'his',
    unitSystem: UnitSystem
}> = ({ profile, onChange, personKey, unitSystem }) => {
    
    const [height, setHeight] = useState<ProfileFormState>({ ft: '5', in: '5' });

    useEffect(() => {
        if (unitSystem === 'imperial') {
            const { ft, inches } = cmToFtIn(profile.height);
            setHeight({ ft: String(ft), in: String(inches) });
        }
    }, [profile.height, unitSystem]);

    const handleDietaryChange = (restrictionId: string) => {
        const newRestrictions = profile.dietaryRestrictions.includes(restrictionId)
            ? profile.dietaryRestrictions.filter(id => id !== restrictionId)
            : [...profile.dietaryRestrictions, restrictionId];
        onChange('dietaryRestrictions', newRestrictions);
    };
    
    const accentColor = personKey === 'her' ? 'var(--color-accent-her)' : 'var(--color-accent-his)';

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold mb-2" style={{ color: accentColor }}>
                {personKey === 'her' ? "👩 Her's Profile" : "👨 His's Profile"}
            </h3>
            
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-subtle)]">Name</label>
                <input 
                    type="text" 
                    value={profile.name} 
                    onChange={e => onChange('name', e.target.value)} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)] px-3 py-2 border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-subtle)]">Age</label>
                    <input 
                        type="number" 
                        value={profile.age} 
                        onChange={e => onChange('age', parseInt(e.target.value) || 0)} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)] px-3 py-2 border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-subtle)]">Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'})</label>
                    <input 
                        type="number" 
                        value={unitSystem === 'imperial' ? Math.round(kgToLbs(profile.weight)) : profile.weight} 
                        onChange={e => onChange('weight', unitSystem === 'imperial' ? lbsToKg(parseFloat(e.target.value)) : parseFloat(e.target.value) || 0)} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)] px-3 py-2 border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" 
                    />
                </div>
            </div>
             
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-subtle)]">Height ({unitSystem === 'imperial' ? 'ft, in' : 'cm'})</label>
                {unitSystem === 'imperial' ? (
                    <div className="grid grid-cols-2 gap-4 mt-1">
                        <input 
                            type="number" 
                            placeholder="ft" 
                            value={height.ft} 
                            min="0"
                            max="8"
                            onChange={e => {
                                const newHeight = { ...height, ft: e.target.value };
                                setHeight(newHeight);
                                onChange('height', ftInToCm(Number(newHeight.ft), Number(newHeight.in)));
                            }} 
                            className="block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)] px-3 py-2 border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" 
                        />
                        <input 
                            type="number" 
                            placeholder="in" 
                            value={height.in} 
                            min="0"
                            max="11"
                            onChange={e => {
                                const value = parseInt(e.target.value) || 0;
                                const clampedValue = Math.min(11, Math.max(0, value));
                                const newHeight = { ...height, in: String(clampedValue) };
                                setHeight(newHeight);
                                onChange('height', ftInToCm(Number(newHeight.ft), Number(newHeight.in)));
                            }} 
                            className="block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)] px-3 py-2 border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" 
                        />
                    </div>
                ) : (
                    <input 
                        type="number" 
                        value={profile.height} 
                        onChange={e => onChange('height', parseInt(e.target.value) || 0)} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)] px-3 py-2 border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" 
                    />
                )}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-subtle)]">Activity Level</label>
                <select 
                    value={profile.activityLevel} 
                    onChange={e => onChange('activityLevel', e.target.value)} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)] px-3 py-2 border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly active</option>
                    <option value="moderate">Moderately active</option>
                    <option value="active">Very active</option>
                    <option value="very_active">Extra active</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-subtle)]">Primary Goal</label>
                <select 
                    value={profile.goal} 
                    onChange={e => onChange('goal', e.target.value)} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-[var(--color-background)] px-3 py-2 border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                >
                    <option value="lose">Weight Loss</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Muscle Gain</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-subtle)] mb-2">Dietary Restrictions</label>
                <div className="grid grid-cols-2 gap-2">
                    {DIETARY_RESTRICTIONS.map(r => (
                        <label key={r.id} className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded transition-colors">
                            <input 
                                type="checkbox" 
                                checked={profile.dietaryRestrictions.includes(r.id)} 
                                onChange={() => handleDietaryChange(r.id)} 
                                className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer w-4 h-4" 
                            />
                            <span className="ml-2 text-sm select-none">{r.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, initialProfiles, initialSettings }) => {
    const [profiles, setProfiles] = useState(initialProfiles);
    const [settings, setSettings] = useState(initialSettings);
    const [activeTab, setActiveTab] = useState<'profiles' | 'app'>('profiles');

    useEffect(() => {
        if (isOpen) {
            setProfiles(initialProfiles);
            setSettings(initialSettings);
        }
    }, [isOpen, initialProfiles, initialSettings]);

    if (!isOpen) return null;

    const handleProfileChange = (person: 'her' | 'his', field: keyof PersonProfile, value: any) => {
        setProfiles(prev => ({
            ...prev,
            [person]: { ...prev[person], [field]: value }
        }));
    };

    const handleSave = () => {
        const updatedHerProfile = calculateNutritionalProfile(profiles.her);
        const updatedHisProfile = calculateNutritionalProfile(profiles.his);
        onSave(settings, { her: updatedHerProfile, his: updatedHisProfile });
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-[var(--color-card-bg)] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-[var(--color-button-secondary)]">
                    <h2 className="text-2xl font-bold text-center">Settings</h2>
                </div>

                <div className="border-b border-[var(--color-button-secondary)] px-6">
                    <nav className="-mb-px flex space-x-6">
                        <button onClick={() => setActiveTab('profiles')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'profiles' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent hover:border-gray-300'}`}>
                            Profiles
                        </button>
                        <button onClick={() => setActiveTab('app')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'app' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent hover:border-gray-300'}`}>
                            App Settings
                        </button>
                    </nav>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow">
                   {activeTab === 'profiles' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <ProfileEditor 
                               profile={profiles.her} 
                               onChange={(field, value) => handleProfileChange('her', field, value)} 
                               personKey="her" 
                               unitSystem={settings.unitSystem} 
                           />
                           <ProfileEditor 
                               profile={profiles.his} 
                               onChange={(field, value) => handleProfileChange('his', field, value)} 
                               personKey="his" 
                               unitSystem={settings.unitSystem} 
                           />
                        </div>
                   )}
                   {activeTab === 'app' && (
                       <div>
                           <h3 className="text-xl font-bold mb-4">Measurement Units</h3>
                           <div className="flex items-center space-x-4">
                               <label className="flex items-center cursor-pointer">
                                   <input type="radio" name="unit" value="imperial" checked={settings.unitSystem === 'imperial'} onChange={() => setSettings(s => ({...s, unitSystem: 'imperial'}))} className="cursor-pointer" />
                                   <span className="ml-2">Imperial (lbs, ft, in)</span>
                               </label>
                               <label className="flex items-center cursor-pointer">
                                   <input type="radio" name="unit" value="metric" checked={settings.unitSystem === 'metric'} onChange={() => setSettings(s => ({...s, unitSystem: 'metric'}))} className="cursor-pointer" />
                                   <span className="ml-2">Metric (kg, cm)</span>
                               </label>
                           </div>
                       </div>
                   )}
                </div>

                <div className="p-4 bg-[var(--color-background)] border-t border-[var(--color-button-secondary)] flex justify-end gap-4 rounded-b-2xl">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-[var(--color-button-secondary)] hover:opacity-80 transition-opacity">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition-opacity">Save & Regenerate Plan</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
