import { timeHandler } from "../../lib/utils/utils";
import { Message, UploadedFile } from "../../types/types";
import FileOther from "./FileOther";
import PhotoAndVideoView from "./PhotoAndVideoView";

function FileMessage({
  file,
  message,
  me,
  type,
}: {
  file: UploadedFile;
  message: Message;
  me: boolean;
  type: string;
}) {
  return (
    <>
      {me ? (
        <div className="flex justify-end gap-2 md:gap-3">
          <div className="flex flex-col gap-1">
            <div className="w-max rounded-lg bg-green-500 text-base text-white dark:text-white md:text-lg">
              <div className="relative flex flex-col">
                {type === "IMAGE" || type === "VIDEO" ? (
                  <PhotoAndVideoView
                    file={file}
                    message={message}
                    type={file?.type}
                  />
                ) : (
                  <FileOther file={file} message={message} type={file?.type} />
                )}
                {((message.message && type === "IMAGE") ||
                  type === "VIDEO") && (
                  <span className="absolute bottom-2 right-2 self-end text-xs md:text-sm">
                    {timeHandler(message.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="h-6 w-6 self-end rounded-full">
            <img
              src={message.sender.picture}
              alt="user avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 md:gap-3">
          <div className="h-6 w-6 self-end rounded-full">
            <img
              src={message.sender.picture}
              alt="user avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="w-max rounded-lg bg-black/90 text-base text-white dark:bg-white dark:text-black md:text-lg">
              <div className="relative">
                {type === "IMAGE" || type === "VIDEO" ? (
                  <PhotoAndVideoView
                    file={file}
                    message={message}
                    type={file?.type}
                  />
                ) : (
                  <FileOther file={file} message={message} type={file?.type} />
                )}
                <span className="absolute bottom-1 right-2 text-xs text-white dark:text-black md:text-sm">
                  {timeHandler(message.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FileMessage;
