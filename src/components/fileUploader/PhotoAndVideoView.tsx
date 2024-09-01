/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message, UploadedFile } from "../../types/types";

function PhotoAndVideoView({
  file,
  type,
  message,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  me,
}: {
  file?: UploadedFile;
  type?: string;
  message?: Message;
  me?: boolean;
}) {
  return (
    <>
      {type === "IMAGE" ? (
        <img
          src={file && file.file.secure_url}
          alt={"image"}
          className="h-[150px] cursor-pointer rounded-lg sm:h-[180px] lg:h-[230px]"
        />
      ) : type === "VIDEO" ? (
        <video
          src={file && file.file.secure_url}
          controls
          className="h-40 cursor-pointer rounded-lg sm:h-44 lg:h-52"
        />
      ) : null}
    </>
  );
}

export default PhotoAndVideoView;
