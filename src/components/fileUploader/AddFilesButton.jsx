import { Plus } from "lucide-react";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { addFiles } from "../../features/chatSlice";
import { getFileType } from "../../lib/utils/file";

function AddFilesButton() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const filesHandler = (e) => {
    e.preventDefault();
    let files = Array.from(e.target.files);
    files.forEach((file) => {
      if (
        file.type !== "application/pdf" &&
        file.type !== "application/msword" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        file.type !== "application/vnd.ms-excel" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        file.type !== "application/vnd.ms-powerpoint" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" &&
        file.type !== "text/plain" &&
        file.type !== "application/zip" &&
        file.type !== "application/x-rar-compressed" &&
        file.type !== "application/x-7z-compressed" &&
        file.type !== "application/x-tar" &&
        file.type !== "application/x-gzip" &&
        file.type !== "audio/mpeg" &&
        file.type !== "audio/wav" &&
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/gif" &&
        file.type !== "image/webp" &&
        file.type !== "video/mp4" &&
        file.type !== "video/mpeg" &&
        file.type !== "video/webm"
      ) {
        files = files.filter((file) => file.name !== file.name);
        return;
      } else if (file.size > 1024 * 1024 * 5) {
        files = files.filter((file) => file.name !== file.name);

        return;
      } else {
        const reader = new FileReader();
        try {
          reader.readAsDataURL(file);
        } catch (error) {
          console.error(error);
        }
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file: file,
              fileData: e.target.result,
              type: getFileType(file.type),
            }),
          );
        };
      }
    });
  };

  return (
    <>
      <div
        className="group relative grid h-16 w-16 cursor-pointer place-items-center rounded-xl dark:bg-[#202124]"
        onClick={() => inputRef.current.click()}
      >
        <Plus strokeWidth={2.5} size={30} />
      </div>
      <input
        type="file"
        hidden
        ref={inputRef}
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,application/zip,application/x-rar-compressed,application/x-7z-compressed,application/x-tar,application/x-gzip,audio/mpeg,audio/wav,image/png,image/jpeg,image/gif,image/webp,video/mp4,video/mpeg,video/webm"
        onChange={filesHandler}
        multiple
      />
    </>
  );
}

export default AddFilesButton;
