import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { TLoginSchema, loginSchema } from "../types/schema.types";
import { useDispatch } from "react-redux";
import { logIn } from "../features/userSlice";
import { Loader } from "lucide-react";
import { useState } from "react";
import logo from "../assets/chatgreen.png";

function LoginForm() {
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<TLoginSchema>({ resolver: zodResolver(loginSchema) });
  const navigator = useNavigate();

  const loginUser = async (userData: { email: string; password: string }) => {
    try {
      setError("");
      const req = await fetch(
        `${import.meta.env.VITE_APP_API_ENDPOINT}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
      );
      const data = await req.json();

      if (data.error) setError(data.error.message);

      if (data.user) {
        dispatch(logIn(data.user));
        navigator("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data: TLoginSchema) => {
    await loginUser(data);
  };

  return (
    <>
      <img src={logo} alt="logo" className="mx-auto mb-2 w-[130px]" />
      {/* <h3 className="text-center text-2xl font-semibold text-[#1D33C0] dark:text-white md:text-3xl">
        Join our chat revolution
      </h3> */}
      <h4 className="mb-2 text-center text-[#80868B] dark:text-[#DADCE0]">
        Sign in and Start Chatting!
      </h4>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <input
              type="email"
              className="w-full rounded-lg border-2 border-[#1D33C0] px-3 py-2 text-[#1D33C0] outline-none placeholder:text-[#1D33C0] focus:ring-4 dark:border-none dark:bg-[#17181B] dark:text-white dark:placeholder:text-[#80868B]"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email?.message && (
              <p className="mt-2 text-xs text-red-700 dark:text-red-300">
                {errors.email?.message}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col">
            <input
              type="password"
              className="w-full rounded-lg border-2 border-[#1D33C0] px-3 py-2 text-[#1D33C0] outline-none placeholder:text-[#1D33C0] focus:ring-4 dark:border-none dark:bg-[#17181B] dark:text-white dark:placeholder:text-[#80868B]"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password?.message && (
              <p className="mt-2 text-xs text-red-700 dark:text-red-300">
                {errors.password?.message}
              </p>
            )}
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className="flex w-full justify-center rounded-lg bg-[#22c55e] px-3 py-2 text-white"
          >
            {isSubmitting && (
              <Loader className="text-muted-foreground animate-spin h-6 w-6" />
            )}
            {!isSubmitting && !error && "Login"}

            {!isSubmitting && error && <p className="text-white">{error}</p>}
          </button>

          <p className="text-center font-semibold dark:text-white">
            you don't an account ?{" "}
            <Link
              to={"/register"}
              className="font-inter text-[#22c55e] dark:text-[#22c55e]"
            >
              Sign Up Here
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export default LoginForm;
