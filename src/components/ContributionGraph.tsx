import { useState, useMemo, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { subDays, eachDayOfInterval, format, getDay } from 'date-fns';
import { cn } from '../lib/utils';
import { APILinks } from '../utilities/apiLinks.ts';

interface BackendDayData {
    score: number;
    size: number;
    completed: boolean;
}

type ActivityLevel = 0 | 1 | 2 | 3 | 4 | 5;

interface DailyActivity {
    date: Date;
    size: number;
    score: number;
    completed: boolean;
    level: ActivityLevel;
}

export function ContributionGraph() {
    const [activityData, setActivityData] = useState<Record<string, BackendDayData>>({});
    const [visibleWeeks, setVisibleWeeks] = useState(52);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setVisibleWeeks(12);      // On phone only 3 months are shown
            else if (window.innerWidth < 1024) setVisibleWeeks(26); // On medium displays 6 months are shown
            else setVisibleWeeks(52);                               // Full year on large screens
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetch(APILinks.activity)
            .then(res => res.json())
            .then(data => {
                setActivityData(data);
            });
    }, []);

    const processedData = useMemo(() => {
        const today = new Date();
        const startDate = subDays(today, 364);
        const days = eachDayOfInterval({ start: startDate, end: today });

        return days.map(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayInfo = activityData[dateStr] || { score: 0, size: 0, completed: false };

            let level: ActivityLevel = 0;

            if (dayInfo.score > 0) { // Scores depend completely on your backend structure
                if (dayInfo.score <= 2) level = 1;
                else if (dayInfo.score <= 4) level = 2;
                else if (dayInfo.score <= 5) level = 3;
                else if (dayInfo.score <= 6) level = 4;
                else level = 5;
            }

            return {
                date,
                size: dayInfo.size,
                score: dayInfo.score,
                completed: dayInfo.completed,
                level
            };
        });
    }, [activityData]);

    // Calculate detailed stats
    const activeDays = useMemo(() =>
        processedData.filter(day => day.size > 0).length,
        [processedData]
    );

    const maxStreak = useMemo(() => {
        let max = 0;
        let current = 0;
        for (const days of processedData) {
            if (days.size > 0) {
                current++;
            } else {
                max = Math.max(max, current);
                current = 0;
            }
        }
        return Math.max(max, current);
    }, [processedData]);

    // Group by weeks for the grid
    const weeks = useMemo(() => {
        const weeksArray: DailyActivity[][] = [];
        let currentWeek: DailyActivity[] = [];

        // Pad the beginning if the first day is not Sunday
        const firstDay = processedData[0];
        const dayOfWeek = getDay(firstDay.date); // 0 = Sunday
        for (let i = 0; i < dayOfWeek; i++) {
            // Nulls or placeholders could be used, but for simplicity we might just skip
            // or handle in rendering. Github aligns columns by week.
            currentWeek.push({
                date: subDays(firstDay.date, dayOfWeek - i),
                size: 0, score: 0, completed: false, level: 0
            });// Placeholder
        }

        processedData.forEach(day => {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeksArray.push(currentWeek);
                currentWeek = [];
            }
        });

        if (currentWeek.length > 0) {
            weeksArray.push(currentWeek);
        }

        return weeksArray.slice(-visibleWeeks);
    }, [processedData, visibleWeeks]);

    const getColor = (level: ActivityLevel) => {
        switch (level) {
            case 0: return 'bg-white/10 hover:bg-white/20'; // Empty
            case 1: return 'bg-blue-200/40 hover:bg-blue-200/60';
            case 2: return 'bg-blue-300/60 hover:bg-blue-300/80';
            case 3: return 'bg-blue-400/70 hover:bg-blue-400/80';
            case 4: return 'bg-blue-500/80 hover:bg-blue-500';
            case 5: return 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_8px_rgba(37,99,235,0.6)]';
        }
    };

    return (
        <GlassCard className="col-span-full items-center justify-between min-h-[300px]">
            <div className="flex w-full items-center justify-between mb-6">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                        Activity Log
                        <div className="text-xs font-normal opacity-60 bg-primary/10 px-2 py-0.5 rounded-full">
                            Logs de SilverBullet
                        </div>
                    </h2>
                    <div className="text-sm text-primary/70">
                        <span className="font-bold">{activeDays}</span> logs en total
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end text-xs text-primary/60">
                        <span>Racha máxima: <span className="font-bold text-primary">{maxStreak} días</span></span>
                    </div>
                </div>
            </div>

            {/* Scrolling Container for Graph */}
            <div className="w-full flex justify-center overflow-hidden py-2">
                <div className="flex gap-1.5 justify-center">
                    {/* Render weeks columns */}
                    {weeks.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-1.5">
                            {week.map((day, dIndex) => (
                                <div
                                    key={dIndex}
                                    title={`${format(day.date, 'dd/MM/yyyy')}: ${day.size} caracteres, \n${day.score} puntos`}
                                    className={cn(
                                        "w-3 h-3 rounded-[3px] transition-all duration-300 cursor-pointer relative group",
                                        getColor(day.level)
                                    )}
                                >
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full flex justify-between items-center mt-4 text-xs text-primary/60 font-medium">
                <div className="flex items-center gap-2">
                    <span>0 puntos</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-[2px] bg-white/10"
                            title="0 puntos"></div> {/* Well this is in spanish but you can change it to your preferred language */}
                        <div className="w-3 h-3 rounded-[2px] bg-blue-200/50"
                            title="2 puntos"></div>
                        <div className="w-3 h-3 rounded-[2px] bg-blue-300/60"
                            title="4 puntos"></div>
                        <div className="w-3 h-3 rounded-[2px] bg-blue-400/70"
                            title="5 puntos"></div>
                        <div className="w-3 h-3 rounded-[2px] bg-blue-500/80"
                            title="6 puntos"></div>
                        <div className="w-3 h-3 rounded-[2px] bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                            title="7 puntos"></div>
                    </div>
                    <span>7 puntos</span>
                </div>
            </div>
        </GlassCard>
    );
}
