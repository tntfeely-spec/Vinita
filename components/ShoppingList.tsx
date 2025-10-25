
import React from 'react';
import { ShoppingCategory } from '../types';
import GroceryIntegration from './integrations/GroceryIntegration';

interface ShoppingListProps {
    categories: ShoppingCategory[];
    onToggleItem: (category: string, itemId: string) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ categories, onToggleItem }) => {
    return (
        <div className="bg-[var(--color-card-bg)] p-6 rounded-2xl mb-8 shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Weekly Shopping List</h2>
                <GroceryIntegration items={categories.flatMap(c => c.items)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {categories.map((category) => (
                    <div key={category.category}>
                        <h3 className="text-xl font-semibold mb-2 text-[var(--color-primary)]">{category.category}</h3>
                        <ul className="space-y-2">
                            {category.items.map((item) => (
                                <li key={item.id} className="flex items-center">
                                    <label className="flex items-center cursor-pointer text-[var(--color-text)]">
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() => onToggleItem(category.category, item.id)}
                                            className="w-5 h-5 rounded text-[var(--color-secondary)] bg-[var(--color-background)] border-[var(--color-text-subtle)] focus:ring-[var(--color-secondary)]"
                                        />
                                        <span className={`ml-3 ${item.checked ? 'line-through text-[var(--color-text-subtle)]' : ''}`}>
                                            {item.name} <span className="text-sm text-[var(--color-text-subtle)]">({item.quantity})</span>
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShoppingList;
