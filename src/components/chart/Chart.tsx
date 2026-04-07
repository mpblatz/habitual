import { useState, useMemo } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { getCurrentDate } from "../../lib/date";
import GridV0 from "./GridV0";

function generateDemoData(year: number): Record<string, GridData> {
    const data: Record<string, GridData> = {};
    const start = new Date(year, 0, 1);
    const end = new Date() < new Date(year, 11, 31) ? new Date() : new Date(year, 11, 31);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const key = `${mm}-${dd}-${year}`;

        // Use a seeded-ish pattern: mix of day-of-year and some trig for variety
        const dayOfYear = Math.floor((d.getTime() - start.getTime()) / 86400000);
        const noise = Math.sin(dayOfYear * 0.8) * 0.5 + Math.cos(dayOfYear * 0.3) * 0.3;
        const weekday = d.getDay();
        // Weekdays more active, weekends lighter
        const weekdayBoost = weekday >= 1 && weekday <= 5 ? 0.3 : -0.1;
        const raw = noise + weekdayBoost + 0.4;
        const value = raw > 0.7 ? 3 : raw > 0.4 ? 2 : raw > 0.1 ? 1 : 0;

        data[key] = { value, habits: [`Demo: ${value}/3 habits`] };
    }
    return data;
}

function computeStats(
    habits: Habit[],
    selectedYear: number,
    currentYear: number
) {
    // Collect all unique dates in the selected year that have any habit entry
    const dateSet = new Set<string>();
    habits.forEach((habit) => {
        Object.keys(habit.history).forEach((date) => {
            // date format: MM-DD-YYYY
            const year = parseInt(date.split("-")[2], 10);
            if (year === selectedYear) {
                dateSet.add(date);
            }
        });
    });

    const sortedDates = Array.from(dateSet).sort((a, b) => {
        const [am, ad, ay] = a.split("-").map(Number);
        const [bm, bd, by] = b.split("-").map(Number);
        return ay !== by ? ay - by : am !== bm ? am - bm : ad - bd;
    });

    const totalDays = sortedDates.length;

    // For each date, check if ALL habits that have an entry that day were completed
    let completedDays = 0;
    sortedDates.forEach((date) => {
        let allComplete = true;
        habits.forEach((habit) => {
            if (habit.history[date]) {
                if (habit.history[date].progress < habit.history[date].goalNumber) {
                    allComplete = false;
                }
            }
        });
        if (allComplete) completedDays++;
    });

    const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    // Streaks — consecutive days where all habits completed, working backwards from today
    // Build a set of "completed" dates for quick lookup
    const completedSet = new Set<string>();
    sortedDates.forEach((date) => {
        let allComplete = true;
        habits.forEach((habit) => {
            if (habit.history[date]) {
                if (habit.history[date].progress < habit.history[date].goalNumber) {
                    allComplete = false;
                }
            }
        });
        if (allComplete) completedSet.add(date);
    });

    // Current streak (from today backwards, only for current year)
    let currentStreak = 0;
    if (selectedYear === currentYear) {
        const today = new Date();
        const d = new Date(today);
        while (true) {
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const yyyy = d.getFullYear();
            const key = `${mm}-${dd}-${yyyy}`;
            if (completedSet.has(key)) {
                currentStreak++;
                d.setDate(d.getDate() - 1);
            } else {
                break;
            }
        }
    }

    // Best streak
    let bestStreak = 0;
    let streak = 0;
    for (const date of sortedDates) {
        if (completedSet.has(date)) {
            streak++;
            if (streak > bestStreak) bestStreak = streak;
        } else {
            streak = 0;
        }
    }

    return { totalDays, completionRate, currentStreak, bestStreak };
}

export default function Chart({ habits }: { habits: Habit[] }) {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [showDemo, setShowDemo] = useState(false);
    const demoData = useMemo(() => generateDemoData(selectedYear), [selectedYear]);

    // Determine the earliest year from habit data
    let earliestYear = currentYear;
    habits.forEach((habit) => {
        Object.keys(habit.history).forEach((date) => {
            const y = parseInt(date.split("-")[2], 10);
            if (y < earliestYear) earliestYear = y;
        });
    });

    function populateGridData() {
        const transformedData: Record<string, GridData> = {};

        habits.forEach((item) => {
            const dates = Object.keys(item.history);
            dates.forEach((date) => {
                // Filter to selected year
                const year = parseInt(date.split("-")[2], 10);
                if (year !== selectedYear) return;

                const { goalNumber, goalUnit, progress } = item.history[date];
                const progressString = `${item.title}: ${progress}/${goalNumber} ${goalUnit}`;

                if (!transformedData[date]) {
                    transformedData[date] = {
                        value: 0,
                        habits: [],
                    };
                }

                if (progress >= goalNumber) {
                    transformedData[date].value += 1;
                }
                transformedData[date].habits.push(progressString);
            });
        });

        for (const date in transformedData) {
            const numOfHabits = transformedData[date].habits.length;
            transformedData[date].value = Math.ceil((transformedData[date].value / numOfHabits) * 3);
        }

        return transformedData;
    }

    const untilDate =
        selectedYear === currentYear
            ? getCurrentDate()
            : `12-31-${selectedYear}`;

    const stats = computeStats(habits, selectedYear, currentYear);

    return (
        <div>
            {/* Header with year nav */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold">Chart</h3>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setSelectedYear((y) => Math.max(y - 1, earliestYear))}
                        disabled={selectedYear <= earliestYear}
                        className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text disabled:text-text-very-faint disabled:cursor-default"
                    >
                        <IconChevronLeft size={16} />
                    </button>
                    <span className="font-mono text-[12px] tracking-wide text-text-muted min-w-[3ch] text-center">
                        {selectedYear}
                    </span>
                    <button
                        onClick={() => setSelectedYear((y) => Math.min(y + 1, currentYear))}
                        disabled={selectedYear >= currentYear}
                        className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text disabled:text-text-very-faint disabled:cursor-default"
                    >
                        <IconChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="border-t border-divider mb-4" />

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                    { label: "Days Tracked", value: stats.totalDays },
                    { label: "Completion", value: `${stats.completionRate}%` },
                    { label: "Current Streak", value: stats.currentStreak },
                    { label: "Best Streak", value: stats.bestStreak },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        style={{
                            backgroundColor: "var(--card-bg)",
                            border: "1px solid var(--border)",
                            boxShadow: "var(--shadow)",
                        }}
                        className="rounded-lg py-3 px-3 text-center"
                    >
                        <p className="font-heading font-bold text-[18px] leading-tight text-text">
                            {stat.value}
                        </p>
                        <p className="font-mono text-[10px] tracking-wide text-text-faint mt-1">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow)",
                }}
                className="flex justify-center rounded-xl py-4 px-4 overflow-x-auto"
            >
                <GridV0 values={showDemo ? demoData : populateGridData()} until={untilDate} />
            </div>

            {/* Demo toggle */}
            <div className="flex justify-end mt-2">
                <button
                    onClick={() => setShowDemo((v) => !v)}
                    className="font-mono text-[10px] tracking-wide text-text-very-faint hover:text-text-faint"
                >
                    {showDemo ? "Hide demo" : "Show demo"}
                </button>
            </div>
        </div>
    );
}
