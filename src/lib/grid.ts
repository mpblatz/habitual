export function generateGridData() {
    let endDate = new Date();
    let startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setDate(startDate.getDate() + 1);

    function isSameDate(date1: Date, date2: Date): boolean {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    let currentDate = new Date(startDate);

    const dayKey = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let data = []; // returnable array for calendar data

    while (currentDate <= endDate) {
        if (isSameDate(currentDate, startDate)) {
            let spaces = currentDate.getDay();
            if (spaces > 0) {
                for (let i = 0; i < spaces; i++) {
                    data.push({
                        date: "",
                        progress: 0,
                        ph: true,
                    });
                }
            }
        } else if (!isSameDate(currentDate, endDate) && currentDate.getDate() == 1) {
            let spaces = 14;
            for (let i = 0; i < spaces; i++) {
                data.push({
                    date: "",
                    progress: 0,
                    ph: true,
                });
            }
        }

        let progress = Math.random(); // retrieve progress for each day here

        // example: Mon 9-21-2023
        let date = `${dayKey[currentDate.getDay()]} ${
            currentDate.getMonth() + 1
        }-${currentDate.getDate()}-${currentDate.getFullYear()}`;

        data.push({
            date: date,
            progress: progress,
            ph: false,
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
}
