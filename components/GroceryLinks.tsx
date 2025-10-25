import React from 'react';
import { GroceryLink } from '../types';

interface GroceryLinksProps {
    links: GroceryLink[];
}

const GroceryLinks: React.FC<GroceryLinksProps> = ({ links }) => (
    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-6 rounded-xl mb-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4">🛒 Order Groceries Online</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {links.map((link) => (
                <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-[var(--color-primary)] font-semibold py-3 px-2 rounded-lg text-center flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-105 hover:shadow-md"
                >
                    <span>{link.icon}</span>
                    <span>{link.name}</span>
                </a>
            ))}
        </div>
    </div>
);

export default GroceryLinks;