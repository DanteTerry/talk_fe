import { useSelector } from "react-redux";
import ChatBar from "./ChatBar";
import ChatMessages from "./ChatMessages";
import { Dispatch, SetStateAction, useRef } from "react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { checkOnlineStatus } from "../lib/utils/utils";
import FilePreview from "./fileUploader/FilePreview";
import { RootState } from "../app/store";

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
  setEmojiPicker: Dispatch<SetStateAction<boolean>>;
  sendMessage: string;
  setSendMessage: Dispatch<SetStateAction<string>>;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const { activeConversation } = useSelector((state: RootState) => state.chat);
  const onlineUsers = useSelector((state: RootState) => state.onlineUsers);
  const { user } = useSelector((state: RootState) => state.user);
  const { files } = useSelector((state: RootState) => state.chat);

  console.log(activeConversation);

  //TODO add emoji picker
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
      className={`relative grid w-full ${files.length ? "grid-rows-11" : "grid-rows-12"}`}
    >
      <ChatBar
        conversation={activeConversation}
        callUser={callUser}
        online={online}
        setCallType={setCallType}
      />
      {files.length > 0 ? <FilePreview /> : <ChatMessages endRef={endRef} />}

      <div className="absolute bottom-36 left-2">
        {emojiPicker && (
          <EmojiPicker
            theme={emojiPicker ? Theme.DARK : Theme.LIGHT}
            emojiStyle={EmojiStyle.FACEBOOK}
            className={` ${emojiPicker && "translate-y-0 transition-all duration-300"}`}
            onEmojiClick={handleEmojiClick}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;
