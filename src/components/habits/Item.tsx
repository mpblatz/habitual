import { IconDots } from "@tabler/icons-react";
import { useState } from "react";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { deleteHabit, updateHabit, updateHistory } from "../../api/habit";
import { getCurrentDate } from "../../lib/date";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../api/firebase";

const today = getCurrentDate();

export default function Item({ habit, setHabits }: { habit: Habit; setHabits: (val: any) => void }) {
    const [editOpen, setEditOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [user] = useAuthState(auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<HabitForm>({
        defaultValues: {
            title: habit.title,
            goalNumber: habit.history[today].goalNumber,
            goalUnit: habit.history[today].goalUnit,
            color: habit.color,
        },
    });

    const handleSetProgress = async (progress: number) => {
        if (user) {
            await updateHistory(habit.id, today, { progress });
        }
        setHabits((prevHabits: Habit[]) => {
            return prevHabits.map((prevHabit) => {
                if (prevHabit.id === habit.id) {
                    return {
                        ...prevHabit,
                        history: {
                            ...prevHabit.history,
                            [today]: {
                                ...prevHabit.history[today],
                                progress,
                            },
                        },
                    };
                }
                return prevHabit;
            });
        });
    };

    const handleEditHabit = async (data: HabitForm) => {
        if (user) {
            await updateHabit(habit.id, { title: data.title, color: data.color });
            await updateHistory(habit.id, today, { goalNumber: data.goalNumber, goalUnit: data.goalUnit });
        }
        setHabits((prevHabits: Habit[]) =>
            prevHabits.map((prevHabit) =>
                prevHabit.id === habit.id
                    ? {
                          ...prevHabit,
                          title: data.title,
                          color: data.color,
                          history: {
                              ...prevHabit.history,
                              [today]: {
                                  ...prevHabit.history[today],
                                  goalNumber: data.goalNumber,
                                  goalUnit: data.goalUnit,
                              },
                          },
                      }
                    : prevHabit
            )
        );
        setEditOpen(false);
    };

    const handleRetireHabit = async () => {
        if (user) {
            await updateHabit(habit.id, { active: false });
        }
        setHabits((prevHabits: Habit[]) =>
            prevHabits.map((prevHabit) =>
                prevHabit.id === habit.id
                    ? {
                          ...prevHabit,
                          active: false,
                      }
                    : prevHabit
            )
        );
        setRemoveOpen(false);
    };

    const handleDeleteHabit = async () => {
        if (user) {
            await deleteHabit(habit.id);
        }
        setHabits((prevHabits: Habit[]) => prevHabits.filter((prevHabit) => prevHabit.id !== habit.id));
        setRemoveOpen(false);
    };

    return (
        <div>
            <div
                className={`bg-b-secondary dark:bg-db-secondary flex flex-row relative justify-between w-full drop-shadow px-2 py-1 rounded-md`}
            >
                <div className="flex flex-row items-center space-x-6">
                    <div className="flex flex-row items-center py-1">
                        <button
                            id="button"
                            className={
                                "rounded-full h-4 w-4 mr-2" +
                                (habit.history[today].progress >= habit.history[today].goalNumber
                                    ? " bg-t-primary dark:bg-dt-primary "
                                    : " border-2 border-t-primary dark:border-dt-primary")
                            }
                            onClick={() =>
                                handleSetProgress(
                                    habit.history[today].progress >= habit.history[today].goalNumber
                                        ? 0
                                        : Number(habit.history[today].goalNumber)
                                )
                            }
                        />
                        <p className="ml-2 mr-4 text-t-primary dark:text-dt-primary">{habit.title}</p>
                    </div>

                    <div className="flex flex-row space-x-3">
                        <button onClick={() => handleSetProgress(habit.history[today].progress - 1)}>-</button>
                        <p>
                            {habit.history[today].progress}/{habit.history[today].goalNumber}{" "}
                            {habit.history[today].goalUnit}
                        </p>
                        <button onClick={() => handleSetProgress(habit.history[today].progress + 1)}>+</button>
                    </div>
                </div>

                <Popover placement="right-start">
                    <PopoverTrigger>
                        <IconDots className="h-6 w-6 text-t-primary dark:text-dt-primary ml-10" />
                    </PopoverTrigger>
                    <PopoverContent className="Popover">
                        <div className="p-2 flex flex-col items-start bg-b-secondary drop-shadow dark:bg-db-secondary rounded-md">
                            <button onClick={() => setEditOpen(true)}>
                                <p className="text-t-primary dark:text-dt-primary">Edit</p>
                            </button>
                            <button onClick={() => setRemoveOpen(true)}>
                                <p className="text-t-primary dark:text-dt-primary">Remove</p>
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Modal open={editOpen} setOpen={setEditOpen} title={"Edit Habit"}>
                <form onSubmit={handleSubmit(handleEditHabit)} className="space-y-2">
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
                                className="p-2 rounded-md shadow-inner bg-b-tertiary dark:bg-db-tertiary "
                            />
                            {errors.goalUnit && (
                                <p className="text-red-1 text-xs">{errors.goalUnit.message as string}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row justify-end pt-4">
                        <button onClick={() => setEditOpen(false)} type="button">
                            <p>Cancel</p>
                        </button>
                        <button className="ml-4 bg-purple-1 text-white drop-shadow-md py-2 px-4 rounded-md">
                            <p>Edit</p>
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal open={removeOpen} setOpen={setRemoveOpen} title={"Remove Habit"}>
                <div className="max-w-[500px]">
                    <p>
                        Are you sure you want to delete your habit? If so, select delete. If you only want to retire
                        your habit, select retire. You will still be able to view retired habit data.
                    </p>
                    <div className="flex flex-row justify-end pt-4">
                        <button onClick={() => setRemoveOpen(false)} type="button">
                            <p>Cancel</p>
                        </button>
                        <button
                            onClick={handleRetireHabit}
                            className="ml-4 bg-b-primary dark:bg-db-tertiary text-t-primary dark:text-dt-primary drop-shadow-md py-2 px-4 rounded-md"
                        >
                            <p>Retire</p>
                        </button>
                        <button
                            onClick={handleDeleteHabit}
                            className="ml-4 bg-red-1 text-white drop-shadow-md py-2 px-4 rounded-md"
                        >
                            <p>Delete</p>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
