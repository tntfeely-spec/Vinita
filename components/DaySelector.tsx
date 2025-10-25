
import React from 'react';

interface DaySelectorProps {
    days: string[];
    selectedDay: string;
    onSelectDay: (day: string) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ days, selectedDay, onSelectDay }) => {
    return (
        <div className="mb-8">
            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => onSelectDay(day)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 whitespace-nowrap ${
                            selectedDay === day
                                ? 'bg-[var(--color-primary)] text-white shadow-md'
                                : 'bg-[var(--color-card-bg)] text-[var(--color-text)] hover:bg-[var(--color-button-secondary)]'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DaySelector;
