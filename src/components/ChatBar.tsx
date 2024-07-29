import { Info, MoveLeft, Phone, Video } from "lucide-react";
import { Conversation } from "../types/types";
import {
  getConversationName,
  getConversationPicture,
} from "../lib/utils/utils";
import { useSelector } from "react-redux";
import { setActiveConversation } from "../features/chatSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function ChatBar({
  conversation,
  online,
  callUser,
  setCallType,
}: {
  conversation: Conversation;
  online: boolean | undefined;
  callUser: (callType: "video" | "voice") => void;
  setCallType: any;
}) {
  const user = useSelector((state: any) => state.user.user);
  const { activeConversation } = useSelector((state: any) => state.chat);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="row-span-1 flex items-center justify-between border-b-2 px-2 shadow-sm dark:border-gray-700 dark:bg-green-500 sm:px-4 lg:px-6">
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            dispatch(setActiveConversation({}));
            navigate("/messages");
          }}
        >
          <MoveLeft size={25} className="text-green-500 dark:text-white" />
        </button>
        <div className="flex items-center justify-center gap-3">
          <div className="h-10!important w-10 gap-10 rounded-full">
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
      </div>

      <div className="flex items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {!activeConversation.isGroup && online && (
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            <button
              onClick={() => {
                setCallType("audio");
                callUser("voice");
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
    </div>
  );
}

export default ChatBar;
