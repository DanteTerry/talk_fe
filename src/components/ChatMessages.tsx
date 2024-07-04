import { useSelector } from "react-redux";
import Message from "./Message";
import { Message as IMessage } from "../types/types";
import EmojiPicker from "emoji-picker-react";

function ChatMessages() {
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="no-scrollbar relative row-span-9 flex h-[82vh] flex-col gap-1 overflow-y-scroll px-5 py-3 text-white scrollbar-track-white scrollbar-thumb-green-500 dark:scrollbar-track-black">
      {messages &&
        messages.map((message: IMessage) => (
          <Message
            message={message}
            key={message._id}
            me={user._id === message.sender._id}
          />
        ))}
    </div>
  );
}

export default ChatMessages;
