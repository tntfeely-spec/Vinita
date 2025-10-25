import React from 'react';
import CheckIcon from './icons/CheckIcon';

interface TipsSectionProps {
    tips: string[];
}

const TipsSection: React.FC<TipsSectionProps> = ({ tips }) => (
    <div className="bg-gradient-to-r from-[var(--color-accent-her)] to-[var(--color-button-secondary)] text-white p-6 rounded-xl mt-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">💡 Success Tips</h2>
        <ul className="space-y-2">
            {tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                    <CheckIcon className="w-6 h-6 mr-2 flex-shrink-0 mt-1" />
                    <span>{tip}</span>
                </li>
            ))}
        </ul>
    </div>
);

export default TipsSection;