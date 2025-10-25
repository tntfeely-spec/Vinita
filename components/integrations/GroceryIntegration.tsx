
import React, { useState } from 'react';
import { ShoppingItem } from '../../types';
import ExportIcon from '../icons/ExportIcon';

interface GroceryIntegrationProps {
    items: ShoppingItem[];
}

const GroceryIntegration: React.FC<GroceryIntegrationProps> = ({ items }) => {
    const [buttonText, setButtonText] = useState('Export List');

    const handleExport = () => {
        const uncheckedItems = items.filter(item => !item.checked);
        const listText = uncheckedItems
            .map(item => `${item.name} (${item.quantity})`)
            .join('\n');

        if (navigator.clipboard) {
            navigator.clipboard.writeText(listText).then(() => {
                setButtonText('Copied!');
                setTimeout(() => setButtonText('Export List'), 2000);
            }).catch(err => {
                alert('Failed to copy list.');
                console.error('Clipboard error:', err);
            });
        } else {
            // Fallback for browsers that don't support navigator.clipboard
            alert('Shopping List:\n' + listText);
        }
    };

    return (
        <button
            onClick={handleExport}
            className="bg-[var(--color-button-secondary)] text-[var(--color-text)] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-80 transition-all duration-200"
        >
            <ExportIcon className="w-4 h-4" />
            {buttonText}
        </button>
    );
};

export default GroceryIntegration;
