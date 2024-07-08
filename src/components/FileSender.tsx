import { Camera, Sparkles, User } from "lucide-react";
import PhotoAndVideo from "./fileUploader/PhotoAndVideo";
import DocumentAttachment from "./fileUploader/DocumentAttachment";

function FileSender() {
  return (
    <div
      className={`absolute bottom-20 left-2 rounded-xl bg-white px-2 py-4 transition-all`}
    >
      <ul className="flex flex-col gap-2">
        <DocumentAttachment />
        <PhotoAndVideo />
        <li className="h-full w-full rounded-md px-2 py-1 transition-all duration-300 hover:bg-gray-300">
          <button className="flex items-center gap-3 text-base">
            <Camera color="#ff2e74" />
            <span className="font-semibold dark:text-black/75">Camera</span>
          </button>
        </li>
        <li className="h-full w-full rounded-md px-2 py-1 transition-all duration-300 hover:bg-gray-300">
          <button className="flex items-center gap-3 text-base">
            <User color="#009de2" />
            <span className="font-semibold dark:text-black/75">Contact</span>
          </button>
        </li>
        <li className="h-full w-full rounded-md px-2 py-1 transition-all duration-300 hover:bg-gray-300">
          <button className="flex items-center gap-3 text-base">
            <Sparkles color="#02a698" />
            <span className="font-semibold dark:text-black/75">
              New Sticker
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default FileSender;
