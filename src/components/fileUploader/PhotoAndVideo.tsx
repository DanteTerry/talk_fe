import { Images } from "lucide-react";
import { useRef, ChangeEvent, MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { addFiles } from "../../features/chatSlice";
import { getFileType } from "../../lib/utils/file";

function PhotoAndVideo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const imageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!e.target.files) return;

    let files = Array.from(e.target.files);

    files.forEach((file) => {
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/gif" &&
        file.type !== "image/webp" &&
        file.type !== "video/mp4" &&
        file.type !== "video/mpeg" &&
        file.type !== "video/webm"
      ) {
        files = files.filter((f) => f.name !== file.name);
        return;
      }

      if (file.size > 1024 * 1024 * 5) {
        files = files.filter((f) => f.name !== file.name);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        if (e.target?.result) {
          dispatch(
            addFiles({
              file: file,
              fileData: e.target.result as string,
              type: getFileType(file.type),
            }),
          );
        }
      };
    });
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <li className="h-full w-full rounded-md px-2 py-1 transition-all duration-300 hover:bg-gray-300">
      <button
        className="flex items-center gap-3 text-base"
        onClick={handleClick}
      >
        <Images color="#007bfc" />
        <span className="font-semibold dark:text-black/75">
          Photos & videos
        </span>
      </button>
      <input
        type="file"
        hidden
        ref={inputRef}
        accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/mpeg,video/webm"
        onChange={imageHandler}
        multiple
      />
    </li>
  );
}

export default PhotoAndVideo;
