import { useDispatch } from "react-redux";
import { dateHandler, trimString } from "../../lib/utils/utils";
import { Conversation } from "../../types/types";
import { setActiveConversation } from "../../features/chatSlice";
import SocketContext from "../../context/SocketContext";

function SingleGroupConversation({
  conversation,
  socket,
}: {
  conversation: Conversation;
  socket: any;
}) {
  const dispatch = useDispatch();

  const openConversation = async () => {
    await dispatch(setActiveConversation(conversation));
    socket.emit("join conversation", conversation._id);
  };

  return (
    <div
      onClick={openConversation}
      className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-md bg-green-500 px-2 py-3 dark:bg-white"
    >
      <div
        className={`h-[52px]!important w-[52px] rounded-full border-2 border-white`}
      >
        <img
          src={conversation.picture}
          alt="user avatar"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col justify-between">
          <span className="font-semibold capitalize text-white opacity-95 dark:text-black">
            {conversation.name}
          </span>
          <span className="text-[13px] font-semibold text-white opacity-95 dark:text-black">
            {trimString(conversation?.latestMessage?.message, 26)}
          </span>
        </div>
        <span className="justify-start text-xs text-green-500 opacity-95 dark:text-green-500">
          {dateHandler(conversation?.latestMessage?.createdAt)}
        </span>
      </div>
    </div>
  );
}

const singleConversationWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <SingleGroupConversation {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default singleConversationWithSocket;