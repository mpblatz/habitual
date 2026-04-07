import { getCurrentDate } from "../../lib/date";
import GridV0 from "./GridV0";

export default function Chart({ habits }: { habits: Habit[] }) {
    function populateGridData() {
        const transformedData: Record<string, GridData> = {};

        habits.forEach((item) => {
            const dates = Object.keys(item.history);
            dates.forEach((date) => {
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

    return (
        <div>
            <h3 className="font-heading font-bold">Chart</h3>
            <div className="border-t border-divider mb-3" />
            <div
                style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
                className="inline-flex rounded-xl py-4 px-4 overflow-x-auto max-w-full"
            >
                <GridV0 values={populateGridData()} until={getCurrentDate()} />
            </div>
        </div>
    );
}
