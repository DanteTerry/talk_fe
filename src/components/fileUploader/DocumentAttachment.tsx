import { FileText } from "lucide-react";
import { useRef } from "react";
import { addFiles } from "../../features/chatSlice";
import { useDispatch } from "react-redux";
import { getFileType } from "../../lib/utils/file";
import { AppDispatch } from "../../app/store";
import { FileData } from "../../types/types";

// Define the type for file data to be dispatched

function DocumentAttachment() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const documentHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files);
      const validFiles: FileData[] = [];

      fileArray.forEach((file) => {
        if (
          ![
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain",
            "application/zip",
            "application/x-rar-compressed",
            "application/x-7z-compressed",
            "application/x-tar",
            "application/x-gzip",
            "audio/mpeg",
            "audio/wav",
          ].includes(file.type)
        ) {
          return;
        } else if (file.size > 1024 * 1024 * 5) {
          return;
        } else {
          const reader = new FileReader();

          reader.onload = (e) => {
            const result = e.target?.result as string;
            validFiles.push({
              file: file,
              fileData: result,
              type: getFileType(file.type),
            });
            if (validFiles.length === fileArray.length) {
              validFiles.forEach((fileData) => dispatch(addFiles(fileData)));
            }
          };

          try {
            reader.readAsDataURL(file);
          } catch (error) {
            console.error(error);
          }
        }
      });
    }
  };

  return (
    <li className="h-full w-full rounded-md px-2 py-1 transition-all duration-300 hover:bg-gray-300">
      <button
        className="flex items-center gap-3 text-base"
        onClick={(e) => {
          e.preventDefault();
          inputRef.current?.click();
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
