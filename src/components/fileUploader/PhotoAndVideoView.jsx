import React from "react";

function PhotoAndVideoView({ file, type }) {
  return (
    <>
      {type === "IMAGE" ? (
        <img
          src={file.file.secure_url}
          alt={"image"}
          className="h-[150px] cursor-pointer rounded-lg sm:h-[180px] lg:h-[230px]"
        />
      ) : type === "VIDEO" ? (
        <video
          src={file.file.secure_url}
          controls
          className="h-40 cursor-pointer rounded-lg sm:h-44 lg:h-52"
        />
      ) : null}
    </>
  );
}

export default PhotoAndVideoView;
