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
            <div className="flex flex-col space-y-2">
                <h3>Habits</h3>
                <hr />
                {renderItems()}

                <button
                    onClick={() => {
                        reset();
                        setOpen(true);
                    }}
                    className="flex flex-row space-x-2 m-auto py-2 pl-2 pr-4"
                >
                    <IconCirclePlus />
                    <p className="">Add Habit</p>
                </button>
            </div>

            <Modal open={open} setOpen={setOpen} title={"Add Habit"}>
                <form onSubmit={handleSubmit(handleAddHabit)} className="space-y-2">
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Habit Title"
                            {...register("title", { required: "Habit Title is required", minLength: 2 })}
                            className="p-2 rounded-md shadow-inner bg-b-tertiary dark:bg-db-tertiary w-full"
                        />
                        {errors.title && <p className="text-red-1 text-xs">{errors.title.message as string}</p>}
                    </div>

                    <div className="flex flex-row items-center space-x-2">
                        <div className="space-y-1">
                            <input
                                type="number"
                                placeholder="45"
                                {...register("goalNumber", { required: "Goal Number is required", minLength: 1 })}
                                className="p-2 rounded-md shadow-inner bg-b-tertiary dark:bg-db-tertiary w-[5ch]"
                            />
                            {errors.goalNumber && (
                                <p className="text-red-1 text-xs">{errors.goalNumber.message as string}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <input
                                type="text"
                                placeholder="Minutes"
                                {...register("goalUnit", { required: "Goal Units are required", minLength: 1 })}
                                className="p-2 rounded-md shadow-inner bg-b-tertiary dark:bg-db-tertiary"
                            />
                            {errors.goalUnit && (
                                <p className="text-red-1 text-xs">{errors.goalUnit.message as string}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row justify-end pt-4">
                        <button onClick={() => setOpen(false)} type="button">
                            <p>Cancel</p>
                        </button>
                        <button className="ml-4 bg-purple-1 text-white drop-shadow-md py-2 px-4 rounded-md">
                            <p>Add</p>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
