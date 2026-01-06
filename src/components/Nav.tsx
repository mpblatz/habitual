import { IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { EmailAuthProvider, User, deleteUser, reauthenticateWithCredential, updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, logout, reauthWithGoogle } from "../api/firebase";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import Modal from "./Modal";
import { deleteUserById, getUser } from "../api/user";

interface NameForm {
    name: string;
}

export default function Nav() {
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
    const [changeNameOpen, setChangeNameOpen] = useState(false);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<NameForm>();

    useEffect(() => {
        async function getUserName() {
            if (user) {
                const data = await getUser(user.uid);
                setName(data ? data.name : "");
            }
        }
        const googleAuth = user?.providerData[0].providerId == "google.com";
        if (googleAuth) {
            if (user?.displayName) {
                setValue("name", user.displayName);
                setName(user.displayName);
            }
        } else {
            getUserName();
        }
    }, [user, setValue]);

    const handleChangeName = async (data: NameForm) => {
        if (user && auth.currentUser) {
            updateProfile(auth.currentUser, { displayName: data.name });
            setName(data.name);
        }
        setChangeNameOpen(false);
    };

    const handleDeleteAccount = async () => {
        if (!user) return;

        try {
            if (user.providerData[0]?.providerId === "password" && user.email) {
                await reauthenticateWithEmailAndPassword(user);
            } else {
                await reauthenticateWithGoogle(user);
            }
        } catch (error) {
            handleDeletionError(error);
        }
    };

    const reauthenticateWithEmailAndPassword = async (user: User) => {
        try {
            if (user.email) {
                const credential = EmailAuthProvider.credential(user.email, password);
                reauthenticateWithCredential(user, credential)
                    .then(() => {
                        deleteUserById(user.uid).then(() => deleteUser(user));
                        handleSuccessfulDeletion();
                    })
                    .catch((err) => handleDeletionError(err));
            }
        } catch (error) {
            handleDeletionError(error);
        }
    };

    const reauthenticateWithGoogle = async (user: User) => {
        try {
            await reauthWithGoogle(user);
            await deleteUserById(user.uid);
            await deleteUser(user);
            handleSuccessfulDeletion();
        } catch (error) {
            handleDeletionError(error);
        }
    };

    const handleSuccessfulDeletion = () => {
        setDeleteAccountOpen(false);
        setPasswordError("");
        navigate("/register");
    };

    const handleDeletionError = (error: any) => {
        setPasswordError("Incorrect password or something else went wrong.");
        console.error(error);
    };

    return (
        <div>
            <div className="flex justify-between items-center py-4 space-x-1">
                <h3 className="text-purple-1">Habitual</h3>

                <div>
                    {user ? (
                        <Popover placement="bottom-end">
                            <PopoverTrigger className="flex border-2 border-purple-1 px-2 py-1 rounded-lg space-x-1 text-purple-1 items-center">
                                <IconUser className="w-5 h-5" />
                                <p>{name}</p>
                            </PopoverTrigger>
                            <PopoverContent className="Popover">
                                <div className="flex flex-col items-start p-2 bg-b-secondary drop-shadow dark:bg-db-secondary rounded-md space-y-1">
                                    <button onClick={() => setDeleteAccountOpen(true)}>
                                        <p>Delete Account</p>
                                    </button>
                                    <button onClick={() => setChangeNameOpen(true)}>
                                        <p>Change Name</p>
                                    </button>
                                    <button
                                        onClick={() => {
                                            logout();
                                            navigate("/login");
                                        }}
                                    >
                                        <p>Logout</p>
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="flex border-2 border-purple-1 px-2 py-1 rounded-lg"
                        >
                            <p className="text-purple-1">Login</p>
                        </button>
                    )}
                </div>
            </div>

            <Modal open={changeNameOpen} setOpen={setChangeNameOpen} title="Change Name">
                <form onSubmit={handleSubmit(handleChangeName)}>
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Display Name"
                            {...register("name", { required: "Name is required", minLength: 2 })}
                            className="p-2 rounded-md shadow-inner bg-b-tertiary dark:bg-db-tertiary w-full"
                        />
                        {errors.name && <p className="text-red-1 text-xs">{errors.name.message as string}</p>}
                    </div>

                    <div className="flex flex-row justify-end pt-4">
                        <button onClick={() => setChangeNameOpen(false)} type="button">
                            <p>Cancel</p>
                        </button>
                        <button className="ml-4 bg-purple-1 text-white drop-shadow-md py-2 px-4 rounded-md">
                            <p>Change</p>
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal open={deleteAccountOpen} setOpen={setDeleteAccountOpen} title="Delete Account">
                <div className="max-w-[500px]">
                    <p className="mb-4">
                        Are you sure you want to delete your account? All habit tracking data will be lost.
                    </p>
                    {user?.providerData[0].providerId == "password" && (
                        <div className="space-y-1 mb-4">
                            <p>Enter your password to confirm account deletion.</p>
                            <input
                                type="password"
                                placeholder="Password"
                                className="p-2 rounded-md shadow-inner bg-b-tertiary dark:bg-db-tertiary w-[20ch]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError && <p className="text-red-1 text-xs">{passwordError}</p>}
                        </div>
                    )}
                    <div className="flex flex-row justify-end">
                        <button onClick={() => setDeleteAccountOpen(false)} type="button">
                            <p>Cancel</p>
                        </button>
                        <button
                            onClick={handleDeleteAccount}
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
