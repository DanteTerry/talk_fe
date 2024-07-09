import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { emptyFile } from "../../features/chatSlice";

function FilePreviewHeader() {
  const dispatch = useDispatch();
  return (
    <div className="h-full w-full bg-white px-10 py-5">
      <X
        size={28}
        strokeWidth={2}
        className="cursor-pointer text-gray-700"
        onClick={() => dispatch(emptyFile())}
      />
    </div>
  );
}

export default FilePreviewHeader;
