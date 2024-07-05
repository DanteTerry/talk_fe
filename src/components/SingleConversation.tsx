import { useDispatch } from "react-redux";
import {
  dateHandler,
  getConversationName,
  getConversationPicture,
  trimString,
} from "../lib/utils/utils";
import { Conversation } from "../types/types";
import { setActiveConversation } from "../features/chatSlice";
import SocketContext from "../context/SocketContext";
import { useSelector } from "react-redux";

function SingleConversation({
  conversation,
  socket,
  online,
}: {
  conversation: Conversation;
  socket: any;
  online: boolean;
}) {
  const dispatch = useDispatch();
  const openConversation = async () => {
    await dispatch(setActiveConversation(conversation));
    socket.emit("join conversation", conversation._id);
  };

  const { user } = useSelector((state: any) => state.user);

  return (
    <div
      onClick={openConversation}
      className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-md bg-green-500 px-2 py-3 dark:bg-white"
    >
      <div
        className={`h-[52px]!important w-[52px] rounded-full ${online ? "border-2 border-green-500" : "border-2 border-white"} `}
      >
        <img
          src={getConversationPicture(user, conversation.users)}
          alt="user avatar"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col justify-between">
          <span className="font-semibold text-white opacity-95 dark:text-black">
            {getConversationName(user, conversation.users)}
          </span>
          <span className="text-[13px] font-semibold text-white opacity-95 dark:text-black">
            {trimString(conversation?.latestMessage.message, 26)}
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
    {(socket) => <SingleConversation {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default singleConversationWithSocket;
