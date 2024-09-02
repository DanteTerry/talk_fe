import { SendHorizontal, X } from "lucide-react";
import { useSelector } from "react-redux";
import { formatKbSize, getConversationId } from "../../lib/utils/utils";
import { useState } from "react";
import { uploadFiles } from "../../lib/utils/upload";
import { useDispatch } from "react-redux";
import { emptyFile, removeFile, sendMessages } from "../../features/chatSlice";
import SocketContext from "../../context/SocketContext";
import { ClipLoader } from "react-spinners";
import { Socket } from "socket.io-client";
import { AppDispatch, RootState } from "../../app/store";
import AddFilesButton from "./AddFilesButton";
import FileUploaderInput from "./FileUploaderInput";
import { UserDataForUtil } from "../../types/types";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import VideoThumbnail from "react-video-thumbnail";

function FileViewer({ socket }: { socket: Socket }) {
  const { files, activeConversation } = useSelector(
    (state: RootState) => state.chat,
  );

  console.log(files);
  const dispatch = useDispatch<AppDispatch>();

  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(0);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state: RootState) => state.user.user);
  const { user } = useSelector((state: RootState) => state.user);

  const sendMessageHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    // upload file to cloudinary
    const uploadedFiles = await uploadFiles(files);

    const otherUserId = getConversationId(
      user,
      activeConversation?.users as UserDataForUtil[],
    );

    // send message to the server
    const values = {
      token,
      sendMessage: caption,
      conversation_id: activeConversation?._id as string,
      files: uploadedFiles ? uploadedFiles : [],
      otherUserId,
    };

    // dispatch action to send message
    if (values.conversation_id && values.otherUserId) {
      const newMessage = await dispatch(sendMessages(values));

      if (typeof newMessage.payload !== "string" && newMessage.payload?._id) {
        socket.emit("send message", newMessage.payload);
        dispatch(emptyFile());
      }
      setLoading(false);
    }
  };

  return (
    // header of the file viewer
    <div className="h-full w-full px-10">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <div className="flex h-[380px] w-[319px] flex-col items-center justify-end gap-2 overflow-hidden rounded-xl">
          {files[selectedFile]?.type === "IMAGE" ? (
            <img
              className="w-3/4 rounded-xl object-contain"
              src={files[selectedFile]?.fileData}
              alt={files[selectedFile]?.file?.name}
            />
          ) : files[selectedFile]?.type === "VIDEO" ? (
            <video src={files[selectedFile]?.fileData} controls />
          ) : (
            <img
              className="w-3/4 rounded-xl object-cover"
              src={`../../../public/uploader/${files[selectedFile]?.type}.svg`}
              alt={files[selectedFile]?.file?.name}
            />
          )}

          <div className="flex flex-col">
            <h2 className="text-center text-lg font-semibold text-gray-700 dark:text-green-500">
              {`${files[selectedFile]?.file?.name}`}
            </h2>

            <h3 className="text-center font-semibold text-gray-700 dark:text-white">
              Size : {formatKbSize(files[selectedFile]?.file?.size)}
            </h3>
          </div>
        </div>

        {/* file caption */}
        <FileUploaderInput setCaption={setCaption} caption={caption} />

        {/* selected images array */}
        <div className="mt-2 flex w-full items-center justify-center gap-3">
          <div className="flex w-full justify-center gap-2">
            {files.map((file, index: number) => (
              <div
                key={index}
                onClick={() => setSelectedFile(index)}
                className={`group relative h-16 w-16 cursor-pointer overflow-hidden rounded-xl border-2 ${index === selectedFile ? "border-green-500" : "border-transparent"}`}
              >
                {file.type === "IMAGE" ? (
                  <img
                    className="h-full w-full rounded-xl object-cover"
                    src={file.fileData}
                    alt={file.file.name}
                  />
                ) : file.type === "VIDEO" ? (
                  <VideoThumbnail
                    videoUrl={file?.fileData}
                    className={"h-full w-full object-contain"}
                  />
                ) : (
                  <img
                    className="h-full w-full rounded-xl object-cover"
                    src={`../../../public/uploader/${file?.type}.svg`}
                    alt={file?.file?.name}
                  />
                )}

                <X
                  onClick={() => dispatch(removeFile(index))}
                  className="absolute right-1 top-1 cursor-none opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:cursor-pointer"
                  size={20}
                  strokeWidth={2}
                />
              </div>
            ))}

            {/* add files button */}
            <AddFilesButton />
          </div>

          {/* send button */}
          <button
            className="w-[64px]!important h-[64px]!important flex items-center justify-center rounded-full bg-green-500 p-3"
            onClick={sendMessageHandler}
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={35} color="#fff" />
            ) : (
              <SendHorizontal strokeWidth={2} size={35} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const FileViewerWithContext = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any,
) => (
  <SocketContext.Consumer>
    {(socket) => <FileViewer {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default FileViewerWithContext;
