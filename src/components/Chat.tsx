import { useSelector } from "react-redux";
import ChatBar from "./ChatBar";
import ChatMessages from "./ChatMessages";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { checkOnlineStatus } from "../lib/utils/utils";
import FilePreview from "./fileUploader/FilePreview";

function Chat({
  callUser,
  setCallType,
  emojiPicker,
  setEmojiPicker,
  sendMessage,
  setSendMessage,
}: {
  callUser: (callType: "video" | "voice") => void;
  setCallType: Dispatch<SetStateAction<"video" | "voice" | "">>;
  emojiPicker: boolean;
  setEmojiPicker: any;
  sendMessage: string;
  setSendMessage: any;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  const { activeConversation } = useSelector((state: any) => state.chat);
  const onlineUsers = useSelector((state: any) => state.onlineUsers);
  const { user } = useSelector((state: any) => state.user);
  const { files } = useSelector((state: any) => state.chat);

  const conversation = useSelector(
    (state: any) => state.chat.activeConversation,
  );

  const handleEmojiClick = (e, emojiData) => {
    e.preventDefault();
    const { emoji } = emojiData;
  };

  let online;

  if (Object.keys(activeConversation).length > 0) {
    online = activeConversation?._id
      ? checkOnlineStatus(onlineUsers, user, activeConversation?.users)
      : false;
  }

  return (
    <div
      className={`relative grid ${files.length ? "grid-rows-11" : "grid-rows-12"}`}
    >
      <ChatBar
        conversation={conversation}
        callUser={callUser}
        online={online}
        setCallType={setCallType}
      />
      {files.length > 0 ? <FilePreview /> : <ChatMessages endRef={endRef} />}

      <div className="absolute bottom-36 left-2">
        {emojiPicker && (
          <EmojiPicker
            theme={emojiPicker ? "dark" : "light"}
            emojiStyle="facebook"
            className={` ${emojiPicker && "translate-y-0 transition-all duration-300"}`}
            onEmojiClick={handleEmojiClick}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;
