import FilePreviewHeader from "./FilePreviewHeader";

function FilePreview() {
  return (
    <div className="row-span-9 flex h-[90vh] flex-col overflow-hidden text-white">
      <FilePreviewHeader />
    </div>
  );
}

export default FilePreview;
