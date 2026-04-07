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

    const isComplete = habit.history[today].progress >= habit.history[today].goalNumber;

    return (
        <div>
            <div
                style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
                className="relative rounded-lg flex flex-row justify-between w-full px-4 py-3 transition-shadow duration-300 hover:shadow-card-hover"
            >
                <div className="flex flex-row items-center space-x-6">
                    <div className="flex flex-row items-center py-1">
                        <button
                            className={
                                "rounded-full h-4 w-4 mr-2 transition-all" +
                                (isComplete
                                    ? " bg-accent"
                                    : " border-2 border-text-faint hover:border-text-muted")
                            }
                            onClick={() =>
                                handleSetProgress(
                                    isComplete ? 0 : Number(habit.history[today].goalNumber)
                                )
                            }
                        />
                        <p className="ml-2 mr-4 text-text">{habit.title}</p>
                    </div>

                    <div className="flex flex-row items-center space-x-3 font-mono text-[11px] tracking-wide text-text-muted">
                        <button
                            onClick={() => handleSetProgress(habit.history[today].progress - 1)}
                            className="w-6 h-6 rounded bg-btn-bg border border-line hover:border-line-hover flex items-center justify-center"
                        >
                            -
                        </button>
                        <span>
                            {habit.history[today].progress}/{habit.history[today].goalNumber}{" "}
                            {habit.history[today].goalUnit}
                        </span>
                        <button
                            onClick={() => handleSetProgress(habit.history[today].progress + 1)}
                            className="w-6 h-6 rounded bg-btn-bg border border-line hover:border-line-hover flex items-center justify-center"
                        >
                            +
                        </button>
                    </div>
                </div>

                <Popover placement="right-start">
                    <PopoverTrigger>
                        <IconDots className="h-5 w-5 text-text-faint hover:text-text ml-10" />
                    </PopoverTrigger>
                    <PopoverContent className="Popover">
                        <div
                            style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-hover)" }}
                            className="p-1 flex flex-col items-start rounded-lg"
                        >
                            <button
                                onClick={() => setEditOpen(true)}
                                className="text-text-muted hover:text-text text-[13px] px-3 py-1.5 w-full text-left rounded hover:bg-btn-bg"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setRemoveOpen(true)}
                                className="text-text-muted hover:text-text text-[13px] px-3 py-1.5 w-full text-left rounded hover:bg-btn-bg"
                            >
                                Remove
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Modal open={editOpen} setOpen={setEditOpen} title={"Edit Habit"}>
                <form onSubmit={handleSubmit(handleEditHabit)} className="space-y-3">
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
                            onClick={() => setEditOpen(false)}
                            type="button"
                            className="px-3 py-1.5 rounded-lg text-text-muted hover:text-text text-[13px]"
                        >
                            Cancel
                        </button>
                        <button className="px-4 py-1.5 bg-accent text-white rounded-lg text-[13px] font-medium hover:opacity-90">
                            Edit
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal open={removeOpen} setOpen={setRemoveOpen} title={"Remove Habit"}>
                <div className="max-w-[500px]">
                    <p className="text-[13px] text-text-muted">
                        Are you sure you want to delete your habit? If so, select delete. If you only want to retire
                        your habit, select retire. You will still be able to view retired habit data.
                    </p>
                    <div className="flex flex-row justify-end pt-4 space-x-3">
                        <button
                            onClick={() => setRemoveOpen(false)}
                            type="button"
                            className="px-3 py-1.5 rounded-lg text-text-muted hover:text-text text-[13px]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRetireHabit}
                            className="px-4 py-1.5 bg-btn-bg border border-line text-text rounded-lg text-[13px] font-medium hover:border-line-hover"
                        >
                            Retire
                        </button>
                        <button
                            onClick={handleDeleteHabit}
                            className="px-4 py-1.5 bg-error text-white rounded-lg text-[13px] font-medium hover:opacity-90"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
