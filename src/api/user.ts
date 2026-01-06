import { db } from "./firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc } from "firebase/firestore";

export const createUser = async (uid: string, name: string, email: string) => {
    if (uid === "" || name === "" || email === "") {
        console.error("uid, name, or email is not set");
        return;
    }
    try {
        await setDoc(doc(db, "User", uid), {
            name: name,
            email: email,
            date: new Date(),
            color: "red",
        });
    } catch (err) {
        console.error("failed to create user: ", err);
    }
};

export const getUser = async (uid: string) => {
    if (uid === "") {
        console.error("uid is not set");
        return;
    }
    const userDoc = doc(db, "User", uid);
    const userDocSnap = await getDoc(userDoc);
    if (userDocSnap.exists()) {
        let data = userDocSnap.data();
        return data;
    } else {
        console.log("No user data found");
        return;
    }
};

export const updateUser = async (uid: string, user: Partial<UserProfile>) => {
    if (!uid || !user) {
        console.error("uid or user data is not set");
        return;
    }
    try {
        const userDoc = doc(db, "User", uid);
        await updateDoc(userDoc, { ...user });
    } catch (err) {
        console.error("Error updating user: ", err);
    }
};

export const deleteUserById = async (uid: string) => {
    try {
        const habitRef = collection(db, "Habit");
        const q = query(habitRef, where("userId", "==", uid));
        const querySnapshot = await getDocs(q);

        const deletePromises = querySnapshot.docs.map(async (doc) => {
            const historyRef = collection(doc.ref, "history");
            const historySnapshot = await getDocs(historyRef);

            const deleteHistoryPromises = historySnapshot.docs.map(async (historyDoc) => {
                await deleteDoc(historyDoc.ref);
            });

            await Promise.all(deleteHistoryPromises);

            await deleteDoc(doc.ref);
        });

        await Promise.all(deletePromises);

        const userDoc = doc(db, "User", uid);
        await deleteDoc(userDoc);
    } catch (err) {
        console.error("Error deleting user data: ", err);
    }
};
