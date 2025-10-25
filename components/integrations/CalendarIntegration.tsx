
import React from 'react';
import { DayPlan, Meal } from '../../types';
import CalendarIcon from '../icons/CalendarIcon';

interface CalendarIntegrationProps {
    dayPlan: DayPlan;
}

// Helper to format date for ICS file (e.g., 20240728T070000Z)
const formatICSTime = (date: Date, hours: number, minutes: number = 0): string => {
    const eventDate = new Date(date);
    eventDate.setHours(hours, minutes, 0, 0);
    return eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

const generateICSFile = (dayPlan: DayPlan) => {
    const today = new Date();
    // Find the date for the selected day of the week
    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(dayPlan.day);
    const dayDiff = dayIndex - today.getDay();
    const eventDay = new Date(today.setDate(today.getDate() + dayDiff));

    const mealTimes: { [key: string]: { start: number, meal: Meal } } = {
        'Breakfast': { start: 7, meal: dayPlan.meals.her.breakfast },
        'Lunch': { start: 12, meal: dayPlan.meals.her.lunch },
        'Snack': { start: 15, meal: dayPlan.meals.her.snack },
        'Dinner': { start: 18, meal: dayPlan.meals.her.dinner },
    };
    
    // Assume workout is around 4 PM for 1 hour
    const workoutEvent = `
BEGIN:VEVENT
UID:${Date.now()}-workout@mealplan.app
DTSTAMP:${formatICSTime(new Date(), 0, 0)}
DTSTART:${formatICSTime(eventDay, 16, 0)}
DTEND:${formatICSTime(eventDay, 17, 0)}
SUMMARY:Workout: ${dayPlan.workout}
END:VEVENT`;

    const mealEvents = Object.entries(mealTimes).map(([mealType, data]) => {
        return `
BEGIN:VEVENT
UID:${Date.now()}-${mealType.toLowerCase()}@mealplan.app
DTSTAMP:${formatICSTime(new Date(), 0, 0)}
DTSTART:${formatICSTime(eventDay, data.start, 30)}
DTEND:${formatICSTime(eventDay, data.start + 1, 0)}
SUMMARY:${mealType}: ${data.meal.name}
DESCRIPTION:Her: ${data.meal.description.replace(/\n/g, '\\n')}\\nHis: ${dayPlan.meals.his[mealType.toLowerCase() as keyof typeof dayPlan.meals.his].description.replace(/\n/g, '\\n')}
END:VEVENT`;
    }).join('');

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Couple's Meal Plan//EN
${workoutEvent}
${mealEvents}
END:VCALENDAR`.trim();

    return icsContent;
}

const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({ dayPlan }) => {
    
    const handleDownload = () => {
        const icsData = generateICSFile(dayPlan);
        const blob = new Blob([icsData], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${dayPlan.day}-meal-plan.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleDownload}
            className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors duration-200 flex-shrink-0"
        >
            <CalendarIcon className="w-5 h-5" />
            Add to Calendar
        </button>
    );
};

export default CalendarIntegration;
