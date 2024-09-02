import DocumentAttachment from "./fileUploader/DocumentAttachment";
import PhotoAndVideo from "./fileUploader/PhotoAndVideo";

function FileSender() {
  return (
    <div
      className={`absolute bottom-20 left-2 rounded-xl bg-white px-2 py-4 transition-all`}
    >
      <ul className="flex flex-col">
        <DocumentAttachment />
        <PhotoAndVideo />
      </ul>
    </div>
  );
}

export default FileSender;
