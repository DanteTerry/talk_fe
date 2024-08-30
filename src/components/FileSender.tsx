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
      </ul>
    </div>
  );
}

export default FileSender;
