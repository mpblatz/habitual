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
    // console.log(populateGridData());

    return (
        <div>
            <h3>Chart</h3>
            <hr className="mb-2" />
            <div className="bg-white flex justify-center rounded-md drop-shadow py-4 px-1">
                <GridV0 values={populateGridData()} until={getCurrentDate()} />
            </div>
        </div>
    );
}
