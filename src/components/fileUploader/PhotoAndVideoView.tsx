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
            className="h-[150px] cursor-pointer rounded-lg object-cover sm:h-[180px] md:h-[200px] lg:h-[250px]"
          />
          <p className="mt-1 max-w-full px-2 text-sm leading-tight tracking-tight md:text-base">
            {message?.message}
          </p>
        </>
      ) : type === "VIDEO" ? (
        <video
          src={file && file.file.secure_url}
          controls
          className="h-40 cursor-pointer rounded-lg object-cover sm:h-44 md:h-48 lg:h-56"
        />
      ) : null}
    </div>
  );
}

export default PhotoAndVideoView;
