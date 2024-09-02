/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message, UploadedFile } from "../../types/types";

function PhotoAndVideoView({
  file,
  type,
  message,
}: {
  file?: UploadedFile;
  type?: string;
  message?: Message;
}) {
  return (
    <div className="p-1">
      {type === "IMAGE" ? (
        <>
          <img
            src={file && file.file.secure_url}
            alt={"image"}
            className="h-[150px] cursor-pointer rounded-lg sm:h-[180px] lg:h-[230px]"
          />
          <p className="mt-1 max-w-[210px] px-2 leading-tight tracking-tighter">
            {message?.message}
          </p>
        </>
      ) : type === "VIDEO" ? (
        <video
          src={file && file.file.secure_url}
          controls
          className="h-40 cursor-pointer rounded-lg sm:h-44 lg:h-52"
        />
      ) : null}
    </div>
  );
}

export default PhotoAndVideoView;
