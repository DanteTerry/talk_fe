import { TbFileDownload } from "react-icons/tb";
import { timeHandler, trimString } from "../../lib/utils/utils";
import { Message, UploadedFile } from "../../types/types";

function FileOther({
  file,
  type,
  message,
}: {
  file: UploadedFile;
  type: string;
  message: Message;
}) {
  return (
    <div className="flex flex-col justify-center gap-1 px-1">
      <div className="flex max-w-[280px] justify-between gap-4 rounded-lg bg-green-600 px-2 py-2 sm:max-w-[300px] md:max-w-[350px] md:gap-6">
        <div className="flex gap-3">
          <img
            src={`../../../public/uploader/${type}.svg`}
            className="h-10 w-10 md:h-12 md:w-12"
            alt={type}
          />
          <div className="flex flex-col justify-center">
            <span className="text-sm leading-tight md:text-base">
              {trimString(file.file.original_filename, 14)}
            </span>
            <span className="text-xs leading-tight md:text-sm">
              {type} &#183; {(file.file.bytes / 1000).toFixed(2)} KB
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
      <span className="self-end px-1 text-xs md:text-sm">
        {timeHandler(message.createdAt)}
      </span>
    </div>
  );
}

export default FileOther;
