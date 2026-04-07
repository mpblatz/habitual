import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, googleAuthorize, logInWithEmailAndPassword } from "../api/firebase";
import googleLogo from "~/assets/google.png";

export default function LoginPage() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (user) navigate("/");
    }, [user, loading]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        await logInWithEmailAndPassword(data.email, data.password);
    };
    return (
        <div className="flex justify-center items-center w-full h-screen">
            <div
                style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
                className="flex flex-col p-8 rounded-xl space-y-4 w-full max-w-[400px]"
            >
                <button onClick={() => navigate("/")}>
                    <h1 className="text-accent mx-auto font-heading">Habitual</h1>
                </button>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Email Address"
                            {...register("email", { required: "Email is required" })}
                            className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-full focus:outline-none focus:border-line-hover"
                        />
                        {errors.email && <p className="text-error text-xs">{errors.email.message as string}</p>}
                    </div>

                    <div className="space-y-1">
                        <input
                            type="password"
                            placeholder="Password"
                            {...register("password", { required: "Password is required", min: 8 })}
                            className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-full focus:outline-none focus:border-line-hover"
                        />
                        {errors.password && <p className="text-error text-xs">{errors.password.message as string}</p>}
                    </div>

                    <input
                        type="submit"
                        value="Login"
                        className="bg-accent text-white py-2.5 rounded-lg font-medium text-[13px] cursor-pointer hover:opacity-90"
                    />
                </form>

                <div className="flex items-center">
                    <div className="flex-grow border-t border-divider" />
                    <span className="px-4 text-text-faint font-mono text-[11px] tracking-wide">or</span>
                    <div className="flex-grow border-t border-divider" />
                </div>
                <button
                    className="bg-btn-bg border border-line text-text py-2.5 rounded-lg flex flex-row justify-center items-center hover:border-line-hover text-[13px]"
                    onClick={() => googleAuthorize()}
                >
                    <img src={googleLogo} className="w-5 mr-2" />
                    Login with Google
                </button>

                <Link to="/reset" className="self-end mb-4">
                    <span className="text-text-faint text-[12px] hover:text-text-muted">Forgot Password</span>
                </Link>
                <div className="flex flex-row space-x-2 text-[13px]">
                    <span className="text-text-muted">Don't have an account?</span>
                    <Link to="/register" className="text-accent hover:opacity-80">
                        Register now
                    </Link>
                </div>
            </div>
        </div>
    );
}
