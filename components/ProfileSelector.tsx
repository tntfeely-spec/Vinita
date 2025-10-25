import React from 'react';
import { ViewFilter } from '../types';

interface ProfileSelectorProps {
  selectedFilter: ViewFilter;
  onFilterChange: (filter: ViewFilter) => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({ selectedFilter, onFilterChange }) => {
  const options: { id: ViewFilter; label: string }[] = [
    { id: 'her', label: "👩 Her" },
    { id: 'both', label: "👫 Both" },
    { id: 'his', label: "👨 His" },
  ];

  const activeIndex = options.findIndex(opt => opt.id === selectedFilter);

  return (
    <div className="bg-[var(--color-background)] p-1 rounded-full flex items-center relative transition-all duration-300">
      <div
        className="absolute top-1 h-8 w-1/3 bg-[var(--color-primary)] rounded-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onFilterChange(option.id)}
          className={`relative z-10 px-4 py-1.5 w-24 text-sm font-semibold rounded-full transition-colors duration-300 ${
            selectedFilter === option.id
              ? 'text-white'
              : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text)]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileSelector;
