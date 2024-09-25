import { useDispatch } from "react-redux";
import {
  dateHandler,
  getConversationName,
  getConversationPicture,
  trimString,
} from "../lib/utils/utils";
import { Conversation } from "../types/types";
import { emptyMessages, setActiveConversation } from "../features/chatSlice";
import SocketContext from "../context/SocketContext";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { setPage } from "../features/pageSlice";
import { AppDispatch, RootState } from "../app/store";

export function SingleConversation({
  conversation,
  socket,
  online,
}: {
  conversation: Conversation;
  socket: Socket;
  online: boolean;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const openConversation = async () => {
    dispatch(setPage(1));
    await dispatch(emptyMessages());
    await dispatch(setActiveConversation(conversation));
    socket.emit("join conversation", conversation._id);
  };

  return (
    <div
      onClick={openConversation}
      className={`mb-3 flex w-full cursor-pointer items-center gap-3 rounded-md bg-green-500 px-2 py-3 dark:bg-white`}
    >
      <div
        className={`h-[52px]!important w-[52px] rounded-full ${online ? "border-2 dark:border-green-500" : "border-2 border-green-500 dark:border-white"} `}
      >
        <img
          src={getConversationPicture(user, conversation.users)}
          alt="user avatar"
          className="h-[52px]!important w-[52px] rounded-full object-cover"
        />
      </div>
      <div className="relative flex w-full justify-between">
        <div className="flex flex-col justify-between">
          <span className="font-semibold text-white opacity-95 dark:text-black">
            {getConversationName(user, conversation.users)}
          </span>
          <span className="text-[13px] font-semibold text-white opacity-95 dark:text-black">
            {trimString(conversation?.latestMessage?.message, 32)}
          </span>
        </div>
        <span className="absolute right-0 h-full justify-start pl-2 text-xs text-green-500 opacity-95 dark:bg-white dark:text-green-500">
          {dateHandler(conversation?.latestMessage?.createdAt)}
        </span>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const singleConversationWithSocket = (props: any) => (
  <SocketContext.Consumer>
    {(socket) => <SingleConversation {...props} socket={socket} />}
  </SocketContext.Consumer>
);

// eslint-disable-next-line react-refresh/only-export-components
export default singleConversationWithSocket;
