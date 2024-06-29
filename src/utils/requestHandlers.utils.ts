import { TRegisterSchema } from "../types/schema.types";

export const postUser = async (data: TRegisterSchema) => {
  try {
    const req = await fetch(import.meta.env.VITE_APP_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await req.json();
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
