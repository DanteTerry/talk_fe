import { TbFileDownload } from "react-icons/tb";
import { timeHandler, trimString } from "../../lib/utils/utils";

function FileOther({
  file,
  type,
  message,
}: {
  file: any;
  type: string;
  message: any;
}) {
  return (
    <div className="flex flex-col justify-center gap-1 px-1">
      <div className="flex max-w-[300px] justify-between gap-10 rounded-lg bg-green-600 px-2 py-2">
        <div className="flex gap-3">
          <img src={`../../../public/uploader/${type}.svg`} className="h-12" />
          <div className="flex flex-col justify-center">
            <span className="leading-tight">
              {trimString(file.file.original_filename, 14)}
            </span>
            <span className="text-sm leading-tight">
              {type} &#183; {file.file.bytes / 1000} KB
            </span>
          </div>
        </div>
        <a
          href={file.file.secure_url}
          target="_blank"
          className="flex h-10 w-10 items-center justify-center border-gray-300"
        >
          <TbFileDownload size={25} />
        </a>
      </div>
      <span className="self-end px-1 text-xs">
        {timeHandler(message.createdAt)}
      </span>
    </div>
  );
}

export default FileOther;
