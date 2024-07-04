import { useSelector } from "react-redux";
import ChatBar from "./ChatBar";
import ChatMessages from "./ChatMessages";
import Inputs from "./Inputs";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getConversationMessages } from "../features/chatSlice";

function Chat() {
  const conversation = useSelector(
    (state: any) => state.chat.activeConversation,
  );

  const { messages: conversationMessages } = useSelector(
    (state: any) => state.chat,
  );
  const { activeConversation } = useSelector((state: any) => state.chat);
  const { token } = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  const values = {
    token,
    conversation_id: activeConversation._id,
  };

  useEffect(() => {
    if (activeConversation._id) {
      dispatch(getConversationMessages(values));
    }
  }, [activeConversation]);

  return (
    <div className="grid grid-rows-12">
      <ChatBar conversation={conversation} />
      <ChatMessages />
      <Inputs />
    </div>
  );
}

export default Chat;
