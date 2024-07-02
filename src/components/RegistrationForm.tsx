import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { TRegisterSchema, registerSchema } from "../types/schema.types";
import { CircleCheck, Loader } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logIn } from "../features/userSlice";
import Picture from "./Picture";
import { UserData } from "../types/types";
import axios from "axios";

function RegistrationForm() {
  // State for tracking user creation status
  const [createUser, setCreatedUser] = useState<"pending" | true | false>(
    "pending",
  );
  const [error, setError] = useState<string>("");

  const [picture, setPicture] = useState<File | null>(null);

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<TRegisterSchema>({ resolver: zodResolver(registerSchema) });

  let userData: UserData;

  const createUserFunction = async (data: UserData) => {
    try {
      // Send user data to the server for registration
      const req = await fetch(
        `${import.meta.env.VITE_APP_API_ENDPOINT}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      const res = await req.json();

      if (res.user) {
        // Dispatch action to log in the user
        dispatch(logIn(res.user));
        setCreatedUser(true);
        navigator("/login");
      } else {
        setCreatedUser(false);
      }

      if (res.error) setError(res.error.message);

      return res;
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle form submission
  const onSubmit = async (data: TRegisterSchema) => {
    const { firstName, lastName, email, password } = data;

    const user = {
      name: `${firstName} ${lastName}`,
      email,
      password,
    };

    userData = user;

    if (picture) {
      await uploadImage().then(async (imageData) => {
        const newData = { ...userData, picture: imageData?.secure_url };
        const newUser = await createUserFunction(newData);
        return newUser;
      });
    } else {
      await createUserFunction(userData);
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("upload_preset", import.meta.env.VITE_APP_CLOUD_SECRET);
    if (picture) {
      formData.append("file", picture);
    }

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUD_NAME}/image/upload`,
      formData,
    );

    return data;
  };

  return (
    <>
      {/* Registration form title */}
      <h3 className="text-center text-3xl font-semibold text-[#1D33C0] dark:text-white">
        Join our chat revolution
      </h3>

      {/* Registration form subtitle */}
      <h4 className="mb-3 text-center text-[#80868B] dark:text-[#DADCE0]">
        Sign Up and Start Chatting!
      </h4>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            {/* First Name input */}
            <div className="flex flex-col">
              <input
                type="text"
                className="w-full rounded-lg border-2 border-[#1D33C0] px-3 py-2 text-[#1D33C0] outline-none placeholder:text-[#1D33C0] focus:ring-4 dark:border-none dark:bg-[#17181B] dark:text-white dark:placeholder:text-[#80868B]"
                placeholder="First Name"
                {...register("firstName")}
              />

              {/* First Name input error message */}
              {errors.firstName?.message && (
                <p className="mt-2 text-xs text-red-300">
                  {errors.firstName?.message}
                </p>
              )}
            </div>

            {/* Last Name input */}
            <div className="flex flex-col">
              <input
                type="text"
                className="rounded-lg border-2 border-[#1D33C0] px-3 py-2 text-[#1D33C0] outline-none placeholder:text-[#1D33C0] focus:ring-4 dark:border-none dark:bg-[#17181B] dark:text-white dark:placeholder:text-[#80868B]"
                placeholder="Last Name"
                {...register("lastName")}
              />

              {/* Last Name input error message */}
              {errors.lastName?.message && (
                <p className="mt-2 text-xs text-red-300">
                  {errors.lastName?.message}
                </p>
              )}
            </div>
          </div>

          {/* Email input */}
          <div className="flex flex-col">
            <input
              type="email"
              className="w-full rounded-lg border-2 border-[#1D33C0] px-3 py-2 text-[#1D33C0] outline-none placeholder:text-[#1D33C0] focus:ring-4 dark:border-none dark:bg-[#17181B] dark:text-white dark:placeholder:text-[#80868B]"
              placeholder="Email"
              {...register("email")}
            />

            {/* Email input error message */}
            {errors.email?.message && (
              <p className="mt-2 text-xs text-red-300">
                {errors.email?.message}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="flex flex-col">
            <input
              type="password"
              className="w-full rounded-lg border-2 border-[#1D33C0] px-3 py-2 text-[#1D33C0] outline-none placeholder:text-[#1D33C0] focus:ring-4 dark:border-none dark:bg-[#17181B] dark:text-white dark:placeholder:text-[#80868B]"
              placeholder="Password"
              {...register("password")}
            />

            {/* Password input error message */}
            {errors.password?.message && (
              <p className="mt-2 text-xs text-red-300">
                {errors.password?.message}
              </p>
            )}
          </div>

          <Picture setPicture={setPicture} picture={picture} />

          {/* Submit button */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-[#22c55e] px-3 py-2 text-white"
          >
            {/* Loading spinner */}
            {isSubmitting && (
              <Loader className="text-muted-foreground animate-spin h-6 w-6" />
            )}

            {/* Registration status message */}
            {!isSubmitting && createUser === "pending" ? (
              "Register"
            ) : !isSubmitting && createUser === true ? (
              <div className="flex gap-2">
                <CircleCheck /> User Created Successfully
              </div>
            ) : !isSubmitting && createUser === false ? (
              <div className="flex gap-2">
                {error.split(": ")[1] || "User Creation Failed"}
              </div>
            ) : (
              ""
            )}
          </button>

          {/* Sign in link */}
          <p className="text-center font-semibold dark:text-white">
            Already have an account ?{" "}
            <Link
              to={"/login"}
              className="font-inter text-[##22c55e] dark:text-[#22c55e]"
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
