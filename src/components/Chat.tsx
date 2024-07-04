import { useSelector } from "react-redux";
import ChatBar from "./ChatBar";
import ChatMessages from "./ChatMessages";
import Inputs from "./Inputs";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getConversationMessages } from "../features/chatSlice";
import EmojiPicker from "emoji-picker-react";

function Chat() {
  const conversation = useSelector(
    (state: any) => state.chat.activeConversation,
  );

  const { activeConversation } = useSelector((state: any) => state.chat);
  const { token } = useSelector((state: any) => state.user.user);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [sendMessage, setSendMessage] = useState("");

  const dispatch = useDispatch();

  const values = {
    token,
    conversation_id: activeConversation._id,
  };

  const handleEmojiClick = (emojiData) => {
    const { emoji } = emojiData;
  };

  useEffect(() => {
    if (activeConversation._id) {
      dispatch(getConversationMessages(values));
    }
  }, [activeConversation]);

  return (
    <div className="relative grid grid-rows-12">
      <ChatBar conversation={conversation} />
      <ChatMessages />
      <Inputs
        sendMessage={sendMessage}
        setSendMessage={setSendMessage}
        setEmojiPicker={setEmojiPicker}
        emojiPicker={emojiPicker}
      />

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
