
import React from 'react';

interface WorkoutIntegrationProps {
    workout: string;
}

const APP_LINKS: { [key: string]: string } = {
    Tonal: 'https://my.tonal.com/',
    Peloton: 'https://members.onepeloton.com/',
    Pickleball: 'https://www.usapickleball.org/',
};

const WorkoutIntegration: React.FC<WorkoutIntegrationProps> = ({ workout }) => {
    const parts = workout.split(/(Tonal|Peloton|Pickleball)/g);

    return (
        <span>
            {parts.map((part, index) => {
                if (APP_LINKS[part]) {
                    return (
                        <a
                            key={index}
                            href={APP_LINKS[part]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline hover:text-white/80 transition-colors"
                        >
                            {part}
                        </a>
                    );
                }
                return part;
            })}
        </span>
    );
};

export default WorkoutIntegration;
