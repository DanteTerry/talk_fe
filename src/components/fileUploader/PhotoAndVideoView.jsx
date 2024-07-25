import React from "react";

function PhotoAndVideoView({ file, type }) {
  return (
    <>
      {type === "IMAGE" ? (
        <img
          src={file.file.secure_url}
          alt={"image"}
          className="h-[230px] cursor-pointer rounded-lg"
        />
      ) : type === "VIDEO" ? (
        <video
          src={file.file.secure_url}
          controls
          className="h-52 cursor-pointer rounded-lg"
        />
      ) : null}
    </>
  );
}

export default PhotoAndVideoView;
