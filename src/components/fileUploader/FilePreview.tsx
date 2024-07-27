import FilePreviewHeader from "./FilePreviewHeader";
import FileViewer from "./FileViewer";

function FilePreview() {
  return (
    <div className="dark: row-span-9 flex h-[90vh] flex-col overflow-hidden bg-[#e9edef] text-white dark:bg-[#17181B]">
      <FilePreviewHeader />
      <FileViewer />
    </div>
  );
}

export default FilePreview;
