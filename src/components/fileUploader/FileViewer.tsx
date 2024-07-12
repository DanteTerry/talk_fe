import { SendHorizontal, X } from "lucide-react";
import { useSelector } from "react-redux";
import { formatKbSize } from "../../lib/utils/utils";
import FileUploaderInput from "./FileUploaderInput";
import { useState } from "react";
import AddFilesButton from "./AddFilesButton";
import { uploadFiles } from "../../lib/utils/upload";
import { useDispatch } from "react-redux";
import { sendMessages } from "../../features/chatSlice";
import SocketContext from "../../context/SocketContext";

function FileViewer({ socket }) {
  const { files, activeConversation } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(0);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.user.user);

  const sendMessageHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    // upload file to cloudinary
    const uploadedFiles = await uploadFiles(files);

    // send message to the server
    const values = {
      token,
      sendMessage: caption,
      conversation_id: activeConversation._id,
      files: uploadedFiles?.length > 0 ? uploadedFiles : [],
    };

    // dispatch action to send message
    const newMessage = await dispatch(sendMessages(values));
    socket.emit("send message", newMessage.payload);
    setLoading(false);
  };

  return (
    // header of the file viewer
    <div className="h-full w-full px-10">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <div className="flex h-[380px] w-[319px] flex-col items-center justify-end gap-2 overflow-hidden rounded-xl">
          {files[selectedFile].type === "IMAGE" ? (
            <img
              className="w-full rounded-xl object-cover"
              src={files[selectedFile]?.fileData}
              alt={files[selectedFile]?.file?.name}
            />
          ) : (
            <img
              className="w-3/4 rounded-xl object-cover"
              src={`../../../public/uploader/${files[selectedFile].type}.svg`}
              alt={files[selectedFile]?.file?.name}
            />
          )}

          <div className="flex flex-col">
            <h2 className="text-center text-lg font-semibold text-gray-700 dark:text-green-500">
              {`${files[selectedFile]?.file?.name}`}
            </h2>

            <h3 className="text-center font-semibold text-gray-700 dark:text-white">
              Size : {formatKbSize(files[selectedFile].file.size)}
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
                className={`group relative h-16 w-16 cursor-pointer overflow-hidden rounded-xl border-2 ${index === selectedFile ? "border-green-500" : "border-transparent"}`}
              >
                {file.type === "IMAGE" ? (
                  <img
                    onClick={() => setSelectedFile(index)}
                    className="h-full w-full rounded-xl object-cover"
                    src={file.fileData}
                    alt={file.file.name}
                  />
                ) : (
                  <img
                    onClick={() => setSelectedFile(index)}
                    className="h-full w-full rounded-xl object-cover"
                    src={`../../../public/uploader/${file.type}.svg`}
                    alt={file.file.name}
                  />
                )}

                <X
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
            className="w-[64px]!important h-[64px]!important rounded-full bg-green-500 p-3"
            onClick={sendMessageHandler}
          >
            <SendHorizontal strokeWidth={2} size={35} />
          </button>
        </div>
      </div>
    </div>
  );
}

const FileViewerWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <FileViewer {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default FileViewerWithContext;
