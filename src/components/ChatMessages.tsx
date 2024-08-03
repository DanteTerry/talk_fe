import { useSelector } from "react-redux";
import Message from "./Message";
import { Message as IMessage } from "../types/types";
import { useEffect } from "react";
import FileMessage from "./fileUploader/FileMessage";
import { SyncLoader } from "react-spinners";

function ChatMessages({ endRef }: { endRef: React.RefObject<HTMLDivElement> }) {
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const typing = useSelector((state) => state.typing);
  const { isDarkMode } = useSelector((state) => state.darkMode);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, typing, endRef]); // Add typing as dependency to scroll when typing state changes

  return (
    <div
      className={`no-scrollbar row-span-9 flex h-[82vh] flex-col gap-[5px] overflow-y-scroll px-2 py-3 text-white scrollbar-track-white scrollbar-thumb-green-500 dark:scrollbar-track-black sm:px-3 md:px-5 ${isDarkMode ? "chatDarkBg" : "chatDarkLight"}`}
    >
      {messages?.length > 0 &&
        messages
          .slice()
          .reverse()
          .map((message: IMessage, index) => (
            <>
              {/* Add a unique key to the parent element */}
              {message?.files?.length > 0 &&
                message?.files.map((file) => (
                  <FileMessage
                    file={file}
                    key={file.file.asset_id}
                    message={message}
                    me={user._id === message.sender._id}
                    type={file?.type}
                  />
                ))}
              {message?.message?.length > 0 && message?.files?.length === 0 && (
                <Message
                  message={message}
                  key={message._id}
                  me={user._id === message.sender._id}
                  messages={messages}
                  index={index}
                />
              )}
            </>
          ))}
      {typing && <SyncLoader color="white" className="pt-3" size={8} />}{" "}
      {/* Render typing indicator only when typing */}
      <div className="mt-3" ref={endRef}></div>{" "}
      {/* Render the endRef element only once */}
    </div>
  );
}

export default ChatMessages;
