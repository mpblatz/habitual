import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { EmailAuthProvider, User, deleteUser, reauthenticateWithCredential, updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, logout, reauthWithGoogle } from "../api/firebase";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import Modal from "./Modal";
import AuthModal from "./AuthModal";
import ThemeToggle from "./ThemeToggle";
import { deleteUserById, getUser } from "../api/user";

interface NameForm {
    name: string;
}

export default function Nav() {
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
    const [changeNameOpen, setChangeNameOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [user] = useAuthState(auth);

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
    };

    const handleDeletionError = (error: any) => {
        setPasswordError("Incorrect password or something else went wrong.");
        console.error(error);
    };

    return (
        <div>
            <div className="flex justify-between items-center py-4 space-x-1">
                <h1 className="font-heading font-bold">Habitual</h1>

                <div className="flex items-center space-x-3">
                    <ThemeToggle />
                    {user ? (
                        <Popover placement="bottom-end">
                            <PopoverTrigger className="flex items-center px-3 py-1.5 rounded-lg space-x-1.5 text-text-muted border border-line bg-btn-bg hover:text-text hover:border-line-hover">
                                <span className="font-mono text-[11px] tracking-wide">{name}</span>
                            </PopoverTrigger>
                            <PopoverContent className="Popover">
                                <div
                                    style={{
                                        backgroundColor: "var(--card-bg)",
                                        border: "1px solid var(--border)",
                                        boxShadow: "var(--shadow-hover)",
                                    }}
                                    className="flex flex-col items-start p-2 rounded-lg space-y-1"
                                >
                                    <button
                                        onClick={() => setDeleteAccountOpen(true)}
                                        className="text-text-muted hover:text-text text-[13px] px-2 py-1 w-full text-left rounded hover:bg-btn-bg"
                                    >
                                        Delete Account
                                    </button>
                                    <button
                                        onClick={() => setChangeNameOpen(true)}
                                        className="text-text-muted hover:text-text text-[13px] px-2 py-1 w-full text-left rounded hover:bg-btn-bg"
                                    >
                                        Change Name
                                    </button>
                                    <button
                                        onClick={() => logout()}
                                        className="text-text-muted hover:text-text text-[13px] px-2 py-1 w-full text-left rounded hover:bg-btn-bg"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <button
                            onClick={() => setAuthModalOpen(true)}
                            className="flex px-3 py-1.5 rounded-lg border border-line bg-btn-bg text-text-muted hover:text-text hover:border-line-hover"
                        >
                            <span className="font-mono text-[11px] tracking-wide">Login</span>
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
                            className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-full focus:outline-none focus:border-line-hover"
                        />
                        {errors.name && <p className="text-error text-xs">{errors.name.message as string}</p>}
                    </div>

                    <div className="flex flex-row justify-end pt-4 space-x-3">
                        <button
                            onClick={() => setChangeNameOpen(false)}
                            type="button"
                            className="px-3 py-1.5 rounded-lg text-text-muted hover:text-text text-[13px]"
                        >
                            Cancel
                        </button>
                        <button className="px-4 py-1.5 bg-accent text-white rounded-lg text-[13px] font-medium hover:opacity-90">
                            Change
                        </button>
                    </div>
                </form>
            </Modal>

            <AuthModal open={authModalOpen} setOpen={setAuthModalOpen} />

            <Modal open={deleteAccountOpen} setOpen={setDeleteAccountOpen} title="Delete Account">
                <div className="max-w-[500px]">
                    <p className="mb-4 text-[13px] text-text-muted">
                        Are you sure you want to delete your account? All habit tracking data will be lost.
                    </p>
                    {user?.providerData[0].providerId == "password" && (
                        <div className="space-y-1 mb-4">
                            <p className="text-[13px]">Enter your password to confirm account deletion.</p>
                            <input
                                type="password"
                                placeholder="Password"
                                className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-[20ch] focus:outline-none focus:border-line-hover"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError && <p className="text-error text-xs">{passwordError}</p>}
                        </div>
                    )}
                    <div className="flex flex-row justify-end space-x-3">
                        <button
                            onClick={() => setDeleteAccountOpen(false)}
                            type="button"
                            className="px-3 py-1.5 rounded-lg text-text-muted hover:text-text text-[13px]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteAccount}
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
