import { useSelector } from "react-redux";
import ChatBar from "./ChatBar";
import Chats from "./Chats";
import Inputs from "./Inputs";

function Chat() {
  const conversation = useSelector(
    (state: any) => state.chat.activeConversation,
  );

  return (
    <div className="grid grid-rows-12">
      <ChatBar conversation={conversation} />
      <Chats />
      <Inputs />
    </div>
  );
}

export default Chat;
