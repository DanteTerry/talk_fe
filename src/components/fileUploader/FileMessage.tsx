import { timeHandler } from "../../lib/utils/utils";
import { Message as IMessage } from "../types/types";
import FileOther from "./FileOther";
import PhotoAndVideoView from "./PhotoAndVideoView";

function FileMessage({
  file,
  message,
  me,
  type,
}: {
  file: any;
  message: IMessage;
  me: boolean;
  type: string;
}) {
  return (
    <>
      {me ? (
        <div className="flex justify-end gap-3">
          <div className="flex flex-col gap-1">
            <div className="w-max rounded-lg bg-green-500 px-1 py-1 text-lg text-white dark:text-white">
              <div className="relative flex flex-col">
                {type === "IMAGE" || type === "VIDEO" ? (
                  <PhotoAndVideoView
                    file={file}
                    message={message}
                    me={me}
                    type={file?.type}
                  />
                ) : (
                  <FileOther
                    file={file}
                    message={message}
                    me={me}
                    type={file?.type}
                  />
                )}

                {((message.message && type === "IMAGE") ||
                  type === "VIDEO") && (
                  <span className="absolute bottom-2 right-2 self-end text-xs">
                    {timeHandler(message.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="h-5!important w-5 self-end rounded-full">
            <img
              src={message.sender.picture}
              alt="user avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="h-5!important w-5 self-end rounded-full">
            <img
              src={message.sender.picture}
              alt="user avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="bg-white-500 w-max rounded-lg bg-black/90 px-3 py-1 text-lg dark:bg-white dark:text-black">
              <div className="relative">
                {type === "IMAGE" || type === "VIDEO" ? (
                  <PhotoAndVideoView
                    file={file}
                    message={message}
                    me={me}
                    type={file?.type}
                  />
                ) : (
                  <FileOther file={file} message={message} type={file?.type} />
                )}
                <span className="absolute bottom-1 right-2 self-end text-xs">
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
