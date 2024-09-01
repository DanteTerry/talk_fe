import { useSelector } from "react-redux";
import ChatBar from "./ChatBar";
import ChatMessages from "./ChatMessages";
import { Dispatch, SetStateAction, useRef } from "react";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import { checkOnlineStatus } from "../lib/utils/utils";
import FilePreview from "./fileUploader/FilePreview";
import { RootState } from "../app/store";
import { Conversation } from "../types/types";

function Chat({
  callUser,
  setCallType,
  emojiPicker,
  sendMessage,
  setSendMessage,
  textRef,
}: {
  callUser: (callType: "video" | "voice") => void;
  setCallType: Dispatch<SetStateAction<"video" | "voice" | "">>;
  emojiPicker: boolean;
  sendMessage: string;
  setSendMessage: Dispatch<SetStateAction<string>>;
  textRef: React.RefObject<HTMLInputElement>;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const { activeConversation } = useSelector((state: RootState) => state.chat);
  const onlineUsers = useSelector((state: RootState) => state.onlineUsers);
  const { user } = useSelector((state: RootState) => state.user);
  const { files } = useSelector((state: RootState) => state.chat);

  // Handle emoji click and insert into the text area
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const { emoji } = emojiData;
    const ref = textRef.current;

    if (ref) {
      ref.focus();
      const start = sendMessage.substring(0, ref.selectionStart as number);
      const end = sendMessage.substring(ref.selectionEnd as number);
      const newText = start + emoji + end;
      setSendMessage(newText);
      const newCursorPosition = start.length + emoji.length;
      setTimeout(() => {
        ref.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    } else {
      console.error("textRef is not available.");
    }
  };

  let online;

  if (Object.keys(activeConversation as Conversation).length > 0) {
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
