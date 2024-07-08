import { Images } from "lucide-react";
import { useRef } from "react";

function PhotoAndVideo() {
  const inputRef = useRef(null);

  const imageHandler = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((img) => {
      if (
        img.type !== "image/png" &&
        img.type !== "image/jpeg" &&
        img.type !== "image/gif" &&
        img.type !== "image/webp"
      ) {
        files = files.filter((file) => file.name !== img.name);
        return;
      } else if (img.size > 1024 * 1024 * 5) {
        files = files.filter((file) => file.name !== img.name);

        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (e) => {};
      }
    });
  };

  return (
    <li className="h-full w-full rounded-md px-2 py-1 transition-all duration-300 hover:bg-gray-300">
      <button
        className="flex items-center gap-3 text-base"
        onClick={() => inputRef.current.click()}
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
        accept="image/png,image/jpeg,image/gif,image/webp"
        onChange={(e) => imageHandler}
      />
    </li>
  );
}

export default PhotoAndVideo;
