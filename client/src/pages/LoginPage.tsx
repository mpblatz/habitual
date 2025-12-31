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
            <div className="flex flex-col bg-b-secondary dark:bg-db-secondary p-8 rounded-lg drop-shadow-md space-y-4">
                <button onClick={() => navigate("/")}>
                    <h1 className="text-purple-1 m-auto">Habitual</h1>
                </button>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Email Address"
                            {...register("email", { required: "Email is required" })}
                            className="p-2 rounded-md shadow-inner bg-b-tertiary dark:bg-db-tertiary w-full"
                        />
                        {errors.email && <p className="text-red-1 text-xs">{errors.email.message as string}</p>}
                    </div>

                    <div className="space-y-1">
                        <input
                            type="password"
                            placeholder="Password"
                            {...register("password", { required: "Password is required", min: 8 })}
                            className="p-2 rounded-md shadow-inner bg-b-tertiary dark:bg-db-tertiary w-full"
                        />
                        {errors.password && <p className="text-red-1 text-xs">{errors.password.message as string}</p>}
                    </div>

                    <input
                        type="submit"
                        value="Login"
                        className="bg-purple-1 text-white drop-shadow-md py-2 rounded-md"
                    />
                </form>

                <div className="flex items-center">
                    <hr className="flex-grow border-t-tertiary" />
                    <span className="px-4 text-t-tertiary">
                        <p>or</p>
                    </span>
                    <hr className="flex-grow border-t-tertiary" />
                </div>
                <button
                    className="bg-b-tertiary text-black drop-shadow-md py-2 rounded-md flex flex-row justify-center items-center"
                    onClick={() => googleAuthorize()}
                >
                    <img src={googleLogo} className="w-7 mr-2" />
                    <p>Login with Google</p>
                </button>

                <Link to="/reset" className="self-end mb-4">
                    <p className="text-t-tertiary text-sm">Forgot Password</p>
                </Link>
                <div className="flex flex-row space-x-2">
                    <p>Don't have an account?</p>
                    <p>
                        <Link to="/register" className="text-purple-1">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
