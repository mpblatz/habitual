import { useState } from "react";
import { useForm } from "react-hook-form";

import { googleAuthorize, logInWithEmailAndPassword, registerWithEmailAndPassword } from "../api/firebase";
import Modal from "./Modal";
import googleLogo from "~/assets/google.png";

interface AuthModalProps {
    open: boolean;
    setOpen: (val: boolean) => void;
}

interface LoginForm {
    email: string;
    password: string;
}

interface RegisterForm {
    name: string;
    email: string;
    password: string;
}

export default function AuthModal({ open, setOpen }: AuthModalProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");

    const loginForm = useForm<LoginForm>();
    const registerForm = useForm<RegisterForm>();

    const handleLogin = async (data: LoginForm) => {
        setError("");
        try {
            await logInWithEmailAndPassword(data.email, data.password);
            setOpen(false);
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        }
    };

    const handleRegister = async (data: RegisterForm) => {
        setError("");
        try {
            await registerWithEmailAndPassword(data.name, data.email, data.password);
            setOpen(false);
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        }
    };

    const handleGoogle = async () => {
        setError("");
        try {
            await googleAuthorize();
            setOpen(false);
        } catch (err: any) {
            setError(err.message || "Google sign-in failed");
        }
    };

    const switchMode = () => {
        setIsSignUp(!isSignUp);
        setError("");
        loginForm.reset();
        registerForm.reset();
    };

    return (
        <Modal open={open} setOpen={setOpen} title={isSignUp ? "Create Account" : "Sign In"}>
            <div className="w-full min-w-[350px]">
                {error && <p className="text-error text-xs mb-4">{error}</p>}

                {isSignUp ? (
                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="flex flex-col space-y-4">
                        <div className="space-y-1">
                            <input
                                type="text"
                                placeholder="Display Name"
                                {...registerForm.register("name", {
                                    required: "Display Name is required",
                                    minLength: 2,
                                })}
                                className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-full focus:outline-none focus:border-line-hover"
                            />
                            {registerForm.formState.errors.name && (
                                <p className="text-error text-xs">
                                    {registerForm.formState.errors.name.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <input
                                type="text"
                                placeholder="Email Address"
                                {...registerForm.register("email", { required: "Email Address is required" })}
                                className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-full focus:outline-none focus:border-line-hover"
                            />
                            {registerForm.formState.errors.email && (
                                <p className="text-error text-xs">
                                    {registerForm.formState.errors.email.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <input
                                type="password"
                                placeholder="Password"
                                {...registerForm.register("password", {
                                    required: "Password is required",
                                    minLength: 8,
                                })}
                                className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-full focus:outline-none focus:border-line-hover"
                            />
                            {registerForm.formState.errors.password && (
                                <p className="text-error text-xs">
                                    {registerForm.formState.errors.password.message as string}
                                </p>
                            )}
                        </div>

                        <input
                            type="submit"
                            value="Register"
                            className="bg-accent text-white py-2.5 rounded-lg font-medium text-[13px] cursor-pointer hover:opacity-90 w-full"
                        />
                    </form>
                ) : (
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="flex flex-col space-y-4">
                        <div className="space-y-1">
                            <input
                                type="text"
                                placeholder="Email Address"
                                {...loginForm.register("email", { required: "Email is required" })}
                                className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-full focus:outline-none focus:border-line-hover"
                            />
                            {loginForm.formState.errors.email && (
                                <p className="text-error text-xs">
                                    {loginForm.formState.errors.email.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <input
                                type="password"
                                placeholder="Password"
                                {...loginForm.register("password", { required: "Password is required", min: 8 })}
                                className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-full focus:outline-none focus:border-line-hover"
                            />
                            {loginForm.formState.errors.password && (
                                <p className="text-error text-xs">
                                    {loginForm.formState.errors.password.message as string}
                                </p>
                            )}
                        </div>

                        <input
                            type="submit"
                            value="Login"
                            className="bg-accent text-white py-2.5 rounded-lg font-medium text-[13px] cursor-pointer hover:opacity-90"
                        />
                    </form>
                )}

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-divider" />
                    <span className="px-4 text-text-faint font-mono text-[11px] tracking-wide">or</span>
                    <div className="flex-grow border-t border-divider" />
                </div>

                <button
                    type="button"
                    className="bg-btn-bg border border-line text-text py-2.5 rounded-lg flex flex-row justify-center items-center hover:border-line-hover text-[13px] w-full"
                    onClick={handleGoogle}
                >
                    <img src={googleLogo} className="w-5 mr-2" />
                    {isSignUp ? "Register with Google" : "Login with Google"}
                </button>

                <div className="flex flex-row space-x-2 text-[13px] mt-4">
                    <span className="text-text-muted">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    </span>
                    <button onClick={switchMode} className="text-accent hover:opacity-80">
                        {isSignUp ? "Login here" : "Register now"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
