import { ImageUp } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";

import { useSelector } from "react-redux";

function Picture({
  picture,
  setPicture,
}: {
  setPicture: Dispatch<SetStateAction<File | null>>;
  picture: File | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const darkMode = useSelector((state) => state.darkMode.isDarkMode);

  const handlerPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pic = e?.target?.files?.[0];

    if (pic?.type === undefined) {
      setError("Please select a file");
      return;
    }

    if (
      pic?.type !== "image/jpeg" &&
      pic?.type !== "image/png" &&
      pic?.type !== "image/webp"
    ) {
      setError(`${pic?.name} format is not supported`);
      return;
    }

    if (pic.size > 1024 * 1024 * 5) {
      setError(`${pic.name} is too large, maximum 5MB allowed`);
      setPicture(null);
      return;
    }

    setError("");
    setPicture(pic);
  };

  return (
    <div className="content-center space-y-1 dark:text-white">
      <button
        type="submit"
        className={`flex w-full items-center ${darkMode ? "border-0" : "border-2"} justify-center gap-2 rounded-lg border-2 border-[#1D33C0] bg-white px-3 py-2 text-[#1D33C0] dark:bg-[#17181B] dark:text-[#80868B] ${error && "border-red-700"} ${error && "dark:border-2 dark:border-red-700"} ${!error && picture?.name && "border-2 border-green-500 text-green-500"} ${
          !error &&
          picture?.name &&
          "text-green-500 dark:border-2 dark:border-green-500"
        }`}
        onClick={(e) => {
          e.preventDefault();
          inputRef.current?.click();
          setError("");
        }}
      >
        {error && <p className="text-red-500">{error}</p>}
        {!error && picture && (
          <p className="text-green-500">{picture.name} selected successfully</p>
        )}
        {!error && !picture && (
          <>
            <ImageUp /> Upload profile picture
          </>
        )}
      </button>

      <input
        type="file"
        name="picture"
        id="picture"
        hidden
        ref={inputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={handlerPicture}
      />
    </div>
  );
}

export default Picture;
