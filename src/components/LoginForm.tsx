import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { TLoginSchema, loginSchema } from "../types/schema.types";

function LoginForm() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<TLoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: TLoginSchema) => {
    console.log(data);
  };

  return (
    <>
      <h3 className="text-center text-3xl font-semibold text-[#1D33C0] dark:text-white">
        Join our chat revolution
      </h3>
      <h4 className="mb-3 text-center text-[#80868B] dark:text-[#DADCE0]">
        Sign in and Start Chatting!
      </h4>

      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-col">
            <input
              type="email"
              className="w-full rounded-lg border-2 border-[#1D33C0] px-3 py-2 text-[#1D33C0] outline-none placeholder:text-[#1D33C0] focus:ring-4 dark:border-none dark:bg-[#17181B] dark:text-white dark:placeholder:text-[#80868B]"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email?.message && (
              <p className="mt-2 text-xs text-red-300">
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
              <p className="mt-2 text-xs text-red-300">
                {errors.password?.message}
              </p>
            )}
          </div>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full rounded-lg bg-[#1D33C0] px-3 py-2 text-white"
        >
          Login
        </button>

        <p className="text-center font-semibold dark:text-white">
          you don't an account ?{" "}
          <Link
            to={"/register"}
            className="font-inter text-[#6876D5] dark:text-[#1D33C0]"
          >
            Sign Up Here
          </Link>
        </p>
      </form>
    </>
  );
}

export default LoginForm;
