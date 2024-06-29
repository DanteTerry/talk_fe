import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { TRegisterSchema, registerSchema } from "../types/schema.types";
import { BanIcon, CircleCheck, Loader } from "lucide-react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

function RegistrationForm() {
  const [createUser, setCreatedUser] = useState<"pending" | true | false>(
    "pending",
  );

  const navigator = useNavigate();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<TRegisterSchema>({ resolver: zodResolver(registerSchema) });

  let userData: any;

  const onSubmit = async (data: TRegisterSchema) => {
    const { firstName, lastName, email, password } = data;

    const user = {
      name: `${firstName} ${lastName}`,
      email,
      password,
    };

    userData = user;

    try {
      const req = await fetch(import.meta.env.VITE_APP_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const res = await req.json();

      if (res.user) {
        setCreatedUser(true);
        navigator("/login");
      } else {
        setCreatedUser(false);
      }

      console.log(res);
      return res;
    } catch (error) {
      if (error) {
        setCreatedUser(false);
      }
      console.log(error);
    }
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
            className="flex w-full items-center justify-center rounded-lg bg-[#1D33C0] px-3 py-2 text-white"
          >
            {isSubmitting && (
              <Loader className="text-muted-foreground h-6 w-6 animate-spin" />
            )}

            {createUser === "pending" ? (
              "Register"
            ) : createUser === true ? (
              <div className="flex gap-2">
                <CircleCheck /> User Created Successfully
              </div>
            ) : createUser === false ? (
              <div className="flex gap-2">
                <BanIcon /> {"Something went wrong"}
              </div>
            ) : (
              ""
            )}
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
