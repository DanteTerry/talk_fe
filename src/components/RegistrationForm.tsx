import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { TRegisterSchema, registerSchema } from "../types/schema.types";

function RegistrationForm() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<TRegisterSchema>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (data: TRegisterSchema) => {
    console.log(data);
  };
  return (
    <>
      <h3 className="text-center text-3xl font-semibold text-[#1D33C0] dark:text-white">
        Join our chat revolution
      </h3>
      <h4 className="mb-3 text-center text-[#80868B] dark:text-[#DADCE0]">
        Sign Up and Start Chatting!
      </h4>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex flex-col">
              <input
                type="text"
                className="w-full rounded-lg border-2 border-[#1D33C0] px-3 py-2 text-[#1D33C0] outline-none placeholder:text-[#1D33C0] focus:ring-4 dark:border-none dark:bg-[#17181B] dark:text-white dark:placeholder:text-[#80868B]"
                placeholder="First Name"
                {...register("firstName")}
              />
              {errors.firstName?.message && (
                <p className="mt-2 text-xs text-red-300">
                  {errors.firstName?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                className="rounded-lg border-2 border-[#1D33C0] px-3 py-2 text-[#1D33C0] outline-none placeholder:text-[#1D33C0] focus:ring-4 dark:border-none dark:bg-[#17181B] dark:text-white dark:placeholder:text-[#80868B]"
                placeholder="Last Name"
                {...register("lastName")}
              />
              {errors.lastName?.message && (
                <p className="mt-2 text-xs text-red-300">
                  {errors.lastName?.message}
                </p>
              )}
            </div>
          </div>
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
          <div className="flex flex-col">
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

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full rounded-lg bg-[#1D33C0] px-3 py-2 text-white"
          >
            Register
          </button>

          <p className="text-center font-semibold dark:text-white">
            Already have an account ?{" "}
            <Link
              to={"/login"}
              className="font-inter text-[#6876D5] dark:text-[#1D33C0]"
            >
              Sign In Here
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export default RegistrationForm;
