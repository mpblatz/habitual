import { IconCirclePlus } from "@tabler/icons-react";
import Item from "./Item";
import Modal from "../Modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createHabit } from "../../api/habit";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../api/firebase";
import { getCurrentDate } from "../../lib/date";

export default function List({ habits, setHabits }: { habits: Habit[]; setHabits: (val: any) => void }) {
    const [open, setOpen] = useState(false);
    const [user] = useAuthState(auth);

    console.log(habits);

    const today = getCurrentDate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<HabitForm>({});

    const handleAddHabit = async (data: HabitForm) => {
        if (user) {
            const newHabit = await createHabit(user.uid, data);
            console.log(newHabit);
            if (newHabit) {
                setHabits((prev: Habit[]) => [...prev, newHabit]);
            } else {
                console.error("Error creating habit");
            }
        } else {
            setHabits((prev: Habit[]) => [
                ...prev,
                {
                    id: prev.length,
                    color: data.color,
                    title: data.title,
                    active: true,
                    history: { [today]: { goalNumber: data.goalNumber, goalUnit: data.goalUnit, progress: 0 } },
                },
            ]);
        }
        setOpen(false);
    };

    function renderItems() {
        return habits.map((habit) => {
            if (habit.active) {
                return <Item key={habit.id} habit={habit} setHabits={setHabits} />;
            }
        });
    }
    return (
        <div>
            <div className="flex flex-col space-y-3">
                <h3 className="font-heading font-bold">Habits</h3>
                <div className="border-t border-divider" />
                {renderItems()}

                <button
                    onClick={() => {
                        reset();
                        setOpen(true);
                    }}
                    className="flex flex-row items-center space-x-2 mx-auto py-2 pl-2 pr-4 text-text-muted hover:text-text rounded-lg"
                >
                    <IconCirclePlus size={18} />
                    <span className="font-mono text-[11px] tracking-wide">Add Habit</span>
                </button>
            </div>

            <Modal open={open} setOpen={setOpen} title={"Add Habit"}>
                <form onSubmit={handleSubmit(handleAddHabit)} className="space-y-3">
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Habit Title"
                            {...register("title", { required: "Habit Title is required", minLength: 2 })}
                            className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-full focus:outline-none focus:border-line-hover"
                        />
                        {errors.title && <p className="text-error text-xs">{errors.title.message as string}</p>}
                    </div>

                    <div className="flex flex-row items-center space-x-2">
                        <div className="space-y-1">
                            <input
                                type="number"
                                placeholder="45"
                                {...register("goalNumber", { required: "Goal Number is required", minLength: 1 })}
                                className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-[5ch] focus:outline-none focus:border-line-hover"
                            />
                            {errors.goalNumber && (
                                <p className="text-error text-xs">{errors.goalNumber.message as string}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <input
                                type="text"
                                placeholder="Minutes"
                                {...register("goalUnit", { required: "Goal Units are required", minLength: 1 })}
                                className="p-2.5 rounded-lg bg-input-bg border border-line text-text focus:outline-none focus:border-line-hover"
                            />
                            {errors.goalUnit && (
                                <p className="text-error text-xs">{errors.goalUnit.message as string}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row justify-end pt-4 space-x-3">
                        <button
                            onClick={() => setOpen(false)}
                            type="button"
                            className="px-3 py-1.5 rounded-lg text-text-muted hover:text-text text-[13px]"
                        >
                            Cancel
                        </button>
                        <button className="px-4 py-1.5 bg-accent text-white rounded-lg text-[13px] font-medium hover:opacity-90">
                            Add
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
