import { getCurrentDate } from "../lib/date";
import { db } from "./firebase";
import { doc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";

export const getAllHabits = async (uid: string) => {
    if (uid === "") {
        console.error("uid is not set");
        return [];
    }
    const habitRef = collection(db, "Habit");
    const q = query(habitRef, where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    const habits: Habit[] = [];
    for (const doc of querySnapshot.docs) {
        const data = doc.data();

        const historyQuerySnapshot = await getDocs(collection(db, `Habit/${doc.id}/history`));
        const historyDocs: Record<string, HabitHistory> = {};
        let lastGoalUnit = "";
        let lastGoalNumber = 0;
        historyQuerySnapshot.forEach((historyDoc) => {
            const date = historyDoc.id;
            const historyData = historyDoc.data() as HabitHistory;
            lastGoalNumber = historyData.goalNumber;
            lastGoalUnit = historyData.goalUnit;
            historyDocs[date] = historyData;
        });

        // if there is no history for today, add a new entry in
        const today = getCurrentDate();
        if (!historyDocs[today]) {
            const newHistory: HabitHistory = { goalUnit: lastGoalUnit, goalNumber: lastGoalNumber, progress: 0 };
            historyDocs[today] = newHistory;

            await createHistory(data.id, today, newHistory);
        }

        habits.push({
            title: data.title,
            active: data.active,
            color: data.color,
            dateCreated: data.dateCreated,
            dateRetired: data.dateRetired,
            id: data.id,
            history: historyDocs,
        });
    }
    return habits;
};

export const createHabit = async (uid: string, data: HabitForm): Promise<Habit | undefined> => {
    if (uid === "") {
        console.error("uid is not set");
        return;
    }
    try {
        const docRef = await addDoc(collection(db, "Habit"), {
            color: "red",
            title: data.title,
            active: true,
            dateCreated: new Date(),
            userId: uid,
        });
        await updateDoc(docRef, { id: docRef.id });

        const today = getCurrentDate();
        console.log(data.goalNumber, data.goalUnit);
        const historyData = {
            progress: 0,
            goalUnit: data.goalUnit,
            goalNumber: data.goalNumber,
        };

        await createHistory(docRef.id, today, historyData);

        return {
            id: docRef.id,
            color: "red",
            title: data.title,
            active: true,
            dateCreated: new Date(),
            dateRetired: undefined,
            history: { [today]: historyData },
        };
    } catch (err) {
        console.error(err);
    }
};

export const updateHabit = async (habitId: string, habit: Partial<Habit>) => {
    if (!habitId || !habit) {
        console.error("habit id or habit is not set");
        return;
    }
    try {
        const habitDoc = doc(db, "Habit", habitId);
        await updateDoc(habitDoc, { ...habit });
    } catch (err) {
        console.error("Error updating habit: ", err);
    }
};

export const deleteHabit = async (habitId: string) => {
    if (!habitId) {
        console.error("habit id is not set");
        return;
    }
    try {
        const habitDoc = doc(db, "Habit", habitId);
        await deleteDoc(habitDoc);
    } catch (err) {
        console.error("Error deleting habit: ", err);
    }
};

export const createHistory = async (habitId: string, date: string, data: Partial<HabitHistory>): Promise<void> => {
    try {
        const historyCollectionRef = collection(db, `Habit/${habitId}/history`);
        const historyDocRef = doc(historyCollectionRef, date);

        await setDoc(historyDocRef, {
            progress: 0,
            goalNumber: data.goalNumber,
            goalUnit: data.goalUnit,
        });
    } catch (err) {
        console.error("Error creating history: ", err);
    }
};

export const updateHistory = async (habitId: string, date: string, data: Partial<HabitHistory>): Promise<void> => {
    const habitHistoryDocRef = doc(db, `Habit/${habitId}/history`, date);

    try {
        await updateDoc(habitHistoryDocRef, { ...data });
        console.log("Habit history updated successfully!");
    } catch (error) {
        console.error("Error updating habit history:", error);
        throw error;
    }
};
