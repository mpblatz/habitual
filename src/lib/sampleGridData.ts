export function generateSampleGridData(): Record<string, GridData> {
    const data: Record<string, GridData> = {};

    // Start from one year ago
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setDate(startDate.getDate() + 1);

    const endDate = new Date();

    const habitTypes = ["Workout", "Reading", "Meditation", "Coding", "Guitar Practice"];

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dateStr = `${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(
            currentDate.getDate()
        ).padStart(2, "0")}-${currentDate.getFullYear()}`;

        // Randomly decide how many habits were completed (0-3)
        const completionLevel = Math.floor(Math.random() * 4);

        // Generate random habits
        const numHabits = Math.floor(Math.random() * 3) + 1; // 1-3 habits per day
        const habits: string[] = [];

        const shuffledHabits = [...habitTypes].sort(() => Math.random() - 0.5);

        for (let i = 0; i < numHabits; i++) {
            const habit = shuffledHabits[i];
            const goalNumber = Math.floor(Math.random() * 30) + 10;
            const progress = Math.random() > 0.3 ? goalNumber : Math.floor(Math.random() * goalNumber);
            const unit =
                habit === "Reading"
                    ? "minutes"
                    : habit === "Workout"
                    ? "reps"
                    : habit === "Meditation"
                    ? "minutes"
                    : habit === "Coding"
                    ? "problems"
                    : "minutes";

            habits.push(`${habit}: ${progress}/${goalNumber} ${unit}`);
        }

        data[dateStr] = {
            value: completionLevel,
            habits: habits,
        };

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
}
