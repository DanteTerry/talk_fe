import DocumentAttachment from "./fileUploader/DocumentAttachment";
import PhotoAndVideoView from "./fileUploader/PhotoAndVideoView";

function FileSender() {
  return (
    <div
      className={`absolute bottom-20 left-2 rounded-xl bg-white px-2 py-4 transition-all`}
    >
      <ul className="flex flex-col gap-2">
        <DocumentAttachment />
        <PhotoAndVideoView />
      </ul>
    </div>
  );
}

export default FileSender;
