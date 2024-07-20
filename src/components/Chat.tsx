import { useSelector } from "react-redux";
import ChatBar from "./ChatBar";
import ChatMessages from "./ChatMessages";
import Inputs from "./Inputs";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getConversationMessages } from "../features/chatSlice";
import EmojiPicker from "emoji-picker-react";
import { checkOnlineStatus } from "../lib/utils/utils";
import FilePreview from "./fileUploader/FilePreview";

function Chat({
  callUser,
  setCallType,
}: {
  callUser: (callType: "video" | "audio") => void;
  setCallType: any;
}) {
  const dispatch = useDispatch();

  const { activeConversation } = useSelector((state: any) => state.chat);
  const { token } = useSelector((state: any) => state.user.user);
  const onlineUsers = useSelector((state: any) => state.onlineUsers);
  const { user } = useSelector((state: any) => state.user);
  const { files } = useSelector((state: any) => state.chat);

  const [emojiPicker, setEmojiPicker] = useState(false);
  const [sendMessage, setSendMessage] = useState("");

  const conversation = useSelector(
    (state: any) => state.chat.activeConversation,
  );

  const values = {
    token,
    conversation_id: activeConversation._id,
  };

  const handleEmojiClick = (emojiData) => {
    const { emoji } = emojiData;
    console.log(emoji);
  };

  let online;

  if (Object.keys(activeConversation).length > 0) {
    online = activeConversation?._id
      ? checkOnlineStatus(onlineUsers, user, activeConversation?.users)
      : false;
  }

  useEffect(() => {
    if (activeConversation._id) {
      dispatch(getConversationMessages(values));
    }
  }, [activeConversation]);

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
      {files.length > 0 ? <FilePreview /> : <ChatMessages />}

      {!files.length ? (
        <Inputs
          sendMessage={sendMessage}
          setSendMessage={setSendMessage}
          setEmojiPicker={setEmojiPicker}
          emojiPicker={emojiPicker}
        />
      ) : null}

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
