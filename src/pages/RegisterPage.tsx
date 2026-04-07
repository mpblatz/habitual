import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";

import { auth, googleAuthorize, registerWithEmailAndPassword } from "../api/firebase";
import googleLogo from "../assets/google.png";

export default function RegisterPage() {
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
    } = useForm<RegisterForm>();

    const onSubmit = async (data: RegisterForm) => {
        await registerWithEmailAndPassword(data.name, data.email, data.password);
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
                            placeholder="Display Name"
                            {...register("name", { required: "Display Name is required", minLength: 2 })}
                            className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-full focus:outline-none focus:border-line-hover"
                        />
                        {errors.name && <p className="text-error text-xs">{errors.name.message as string}</p>}
                    </div>

                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Email Address"
                            {...register("email", { required: "Email Address is required" })}
                            className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-full focus:outline-none focus:border-line-hover"
                        />
                        {errors.email && <p className="text-error text-xs">{errors.email.message as string}</p>}
                    </div>

                    <div className="space-y-1">
                        <input
                            type="password"
                            placeholder="Password"
                            {...register("password", { required: "Password is required", minLength: 8 })}
                            className="p-2.5 rounded-lg bg-input-bg border border-line text-text w-full focus:outline-none focus:border-line-hover"
                        />
                        {errors.password && <p className="text-error text-xs">{errors.password.message as string}</p>}
                    </div>
                    <input
                        type="submit"
                        value="Register"
                        className="bg-accent text-white py-2.5 rounded-lg font-medium text-[13px] cursor-pointer hover:opacity-90 w-full"
                    />
                </form>

                <div className="flex items-center">
                    <div className="flex-grow border-t border-divider" />
                    <span className="px-4 text-text-faint font-mono text-[11px] tracking-wide">or</span>
                    <div className="flex-grow border-t border-divider" />
                </div>
                <button
                    type="button"
                    className="bg-btn-bg border border-line text-text py-2.5 rounded-lg flex flex-row justify-center items-center hover:border-line-hover text-[13px]"
                    onClick={() => googleAuthorize()}
                >
                    <img src={googleLogo} className="w-5 mr-2" />
                    Register with Google
                </button>
                <div className="flex flex-row space-x-2 text-[13px]">
                    <span className="text-text-muted">Already have an account?</span>
                    <Link to="/login" className="text-accent hover:opacity-80">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
}
