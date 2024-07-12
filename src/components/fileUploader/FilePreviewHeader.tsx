import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { emptyFile } from "../../features/chatSlice";
import { useSelector } from "react-redux";

function FilePreviewHeader() {
  const dispatch = useDispatch();
  const { files } = useSelector((state) => state.chat);

  return (
    <div className="flex items-center px-10 pt-5">
      <X
        size={28}
        strokeWidth={2}
        className="cursor-pointer text-gray-700 dark:text-green-500"
        onClick={() => dispatch(emptyFile())}
      />
    </div>
  );
}

export default FilePreviewHeader;