import { FileText } from "lucide-react";
import React, { useRef } from "react";
import { addFiles } from "../../features/chatSlice";
import { useDispatch } from "react-redux";
import { getFileType } from "../../lib/utils/file";

function DocumentAttachment() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const documentHandler = (e) => {
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
        file.type !== "audio/wav"
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
    <li className="h-full w-full rounded-md px-2 py-1 transition-all duration-300 hover:bg-gray-300">
      <button
        className="flex items-center gap-3 text-base"
        onClick={(e) => {
          e.preventDefault();
          inputRef.current.click();
        }}
      >
        <FileText color="#7f66ff" />
        <span className="font-semibold dark:text-black/75">Document</span>
      </button>
      <input
        type="file"
        hidden
        ref={inputRef}
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,application/zip,application/x-rar-compressed,application/x-7z-compressed,application/x-tar,application/x-gzip,audio/mpeg,audio/wav"
        onChange={documentHandler}
        multiple
      />
    </li>
  );
}

export default DocumentAttachment;
