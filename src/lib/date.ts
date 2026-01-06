export function getCurrentDate() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(currentDate.getDate()).padStart(2, "0");

    const dateString = `${month}-${day}-${year}`;

    return dateString;
}
