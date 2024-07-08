import { Images } from "lucide-react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { addFiles } from "../../features/chatSlice";
import { useSelector } from "react-redux";

function PhotoAndVideo() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const imageHandler = (e) => {
    e.preventDefault();
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
        files = files.filter((file) => file.name !== file.name);
        return;
      } else if (file.size > 1024 * 1024 * 5) {
        files = files.filter((file) => file.name !== file.name);

        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file: file,
              fileData: e.target.result,
              type: file.type.split("/")[0],
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
      />
    </li>
  );
}

export default PhotoAndVideo;
