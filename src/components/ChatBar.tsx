import { Info, Phone, Video } from "lucide-react";
import { Conversation } from "../types/types";
import {
  getConversationName,
  getConversationPicture,
} from "../lib/utils/utils";
import { useSelector } from "react-redux";

function ChatBar({
  conversation,
  online,
  callUser,
  setCallType,
}: {
  conversation: Conversation;
  online: boolean | undefined;
  callUser: (callType: "video" | "audio") => void;
  setCallType: any;
}) {
  const user = useSelector((state: any) => state.user.user);
  const { activeConversation } = useSelector((state: any) => state.chat);
  return (
    <div className="row-span-1 flex items-center justify-between border-b-2 px-6 shadow-sm dark:border-gray-700 dark:bg-green-500">
      <div className="flex items-center gap-3">
        <div className="h-10!important w-10 rounded-full">
          <img
            src={
              activeConversation.isGroup
                ? activeConversation.picture
                : getConversationPicture(user, conversation?.users)
            }
            alt="user avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-bold capitalize leading-tight text-green-500 dark:text-white">
            {activeConversation.isGroup
              ? activeConversation.name
              : getConversationName(user, conversation?.users)}
          </p>
          {!activeConversation.isGroup && online && (
            <p className="text-sm leading-tight text-white">online</p>
          )}
        </div>
      </div>

      {!activeConversation.isGroup && (
        <div className="flex items-center gap-10">
          <button
            onClick={() => {
              setCallType("audio");
              callUser("audio");
            }}
          >
            <Phone
              size={24}
              strokeWidth={1.5}
              className="course-pointer text-green-500 dark:text-white"
            />
          </button>
          <button
            onClick={() => {
              setCallType("video");
              callUser("video");
            }}
          >
            <Video
              size={30}
              strokeWidth={1.5}
              className="text-green-500 dark:text-white"
            />
          </button>
        </div>
      )}
      <div className="flex items-center justify-center">
        <button>
          <Info
            size={30}
            strokeWidth={1.5}
            className="text-green-500 dark:text-white"
          />
        </button>
      </div>
    </div>
  );
}

export default ChatBar;
