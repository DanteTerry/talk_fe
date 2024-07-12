import { useSelector } from "react-redux";
import Message from "./Message";
import { Message as IMessage } from "../types/types";
import { useEffect, useRef } from "react";
import FileMessage from "./fileUploader/FileMessage";

function ChatMessages() {
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const endRef = useRef<HTMLDivElement>(null);
  const typing = useSelector((state) => state.typing);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  return (
    <div className="no-scrollbar row-span-9 flex h-[82vh] flex-col gap-1 overflow-y-scroll px-5 py-3 text-white scrollbar-track-white scrollbar-thumb-green-500 dark:scrollbar-track-black">
      {messages.length &&
        messages.map((message: IMessage, index: number) => (
          <>
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
              />
            )}
          </>
        ))}

      {typing ? "Typing..." : ""}
      <div className="mt-2" ref={endRef}></div>
    </div>
  );
}

export default ChatMessages;
