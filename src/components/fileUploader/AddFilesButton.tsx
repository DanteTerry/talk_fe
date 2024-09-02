import { Plus } from "lucide-react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { addFiles } from "../../features/chatSlice";
import { getFileType } from "../../lib/utils/file";
import { AppDispatch } from "../../app/store";

function AddFilesButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const filesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files);

      fileArray.forEach((file) => {
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
          return; // Skip files that don't match allowed types
        } else if (file.size > 1024 * 1024 * 5) {
          return; // Skip files that exceed size limit
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            dispatch(
              addFiles({
                file: file,
                fileData: e.target?.result as string, // Ensure e.target.result is typed as string
                type: getFileType(file.type),
              }),
            );
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  return (
    <>
      <div
        className="group relative grid h-16 w-16 cursor-pointer place-items-center rounded-xl dark:bg-[#202124]"
        onClick={() => inputRef.current?.click()}
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
