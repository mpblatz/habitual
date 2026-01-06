/// <reference types="vite/client" />

interface RegisterForm {
    email: string;
    name: string;
    password: string;
}

interface LoginForm {
    email: string;
    password: string;
}

interface HabitForm {
    color: string;
    goalNumber: number;
    goalUnit: string;
    title: string;
}

interface UserProfile {
    id: string;
    authProvider: string;
    email: string;
    isSetup: boolean;
    name: string;
    color: string;
}

interface Habit {
    id: string;
    active: boolean;
    color: string;
    dateCreated: Date;
    dateRetired: Date | undefined;
    history: Record<string, HabitHistory>;
    title: string;
}

interface HabitHistory {
    progress: number;
    goalNumber: number;
    goalUnit: string;
}

interface Grid {
    habits: Habit[];
}

interface Cell {
    rgbValues: number[];
    date: string;
    progress: number;
    ph: boolean;
}

interface GridData {
    value: number;
    habits: string[];
}
