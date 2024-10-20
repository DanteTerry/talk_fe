import { Languages, MoveLeft, Phone, Video } from "lucide-react";
import { Conversation, UserDataForUtil } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { options } from "../constants/constants";
import { setLanguage } from "../features/translateSlice";
import { setPage } from "../features/pageSlice";
import { useSelector } from "react-redux";
import {
  getConversationName,
  getConversationPicture,
} from "../lib/utils/utils";
import {
  getConversationMessages,
  setActiveConversation,
  setHasNext,
  setMessages,
} from "../features/chatSlice";
import { AppDispatch, RootState } from "../app/store";

function ChatBar({
  conversation,
  online,
  callUser,
  setCallType,
}: {
  conversation: Conversation | null;
  online: boolean | undefined;
  callUser: (callType: "video" | "voice") => void;
  setCallType: Dispatch<SetStateAction<"video" | "voice" | "">>;
}) {
  const user = useSelector((state: RootState) => state.user.user);
  const { activeConversation } = useSelector((state: RootState) => state.chat);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showTranslate, setShowTranslate] = useState(false);
  const translateRef = useRef<HTMLDivElement>(null);
  const { page } = useSelector((state: RootState) => state.page);
  const { language } = useSelector((state: RootState) => state.translate);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        translateRef.current &&
        !translateRef.current.contains(event.target as Node)
      ) {
        setShowTranslate(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [translateRef]);

  // Handle translation by setting new language, resetting messages, and fetching new ones
  const handleTranslate = async (option: {
    name: string;
    code: string;
    flag: string;
  }) => {
    if (activeConversation && user.token) {
      dispatch(setMessages([]));
      if (option.code !== language) {
        // Prevent unnecessary re-render
        dispatch(setLanguage(option.code)); // Set currently selected language
        const values = {
          token: user.token,
          conversation_id: activeConversation?._id,
          lang: option.code,
          page,
        };

        if (activeConversation?._id) {
          dispatch(setPage(1));
          dispatch(
            getConversationMessages(
              values as {
                token: string;
                conversation_id: string;
                lang: string;
                page: number;
              },
            ),
          );
        }
        dispatch(setHasNext(false));
      }
      setShowTranslate(false);
    }
  };

  return (
    <div className="row-span-1 flex items-center justify-between border-b-2 px-2 py-2 shadow-sm dark:border-gray-700 dark:bg-green-500 sm:px-4 lg:px-6">
      {/* Left section: Back button, user picture, and conversation name */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            dispatch(setActiveConversation(null));
            navigate("/messages");
            dispatch(setPage(1));
            dispatch(setHasNext(false));
          }}
        >
          <MoveLeft size={25} className="text-green-500 dark:text-white" />
        </button>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full">
            <img
              src={
                activeConversation?.isGroup
                  ? activeConversation?.picture
                  : getConversationPicture(
                      user,
                      conversation?.users as UserDataForUtil[],
                    )
              }
              alt="user avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-lg font-bold capitalize leading-tight text-green-500 dark:text-white">
              {activeConversation?.isGroup
                ? activeConversation.name
                : getConversationName(
                    user,
                    conversation?.users as UserDataForUtil[],
                  )}
            </p>
            {!activeConversation?.isGroup && online && (
              <p className="text-sm leading-tight text-white">online</p>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Call buttons, translate, and info */}
      <div className="relative flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {!activeConversation?.isGroup && online && (
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            <button
              onClick={() => {
                setCallType("voice");
                callUser("voice");
              }}
            >
              <Phone
                size={24}
                strokeWidth={1.5}
                className="text-green-500 dark:text-white"
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

        <div className="relative flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          <button onClick={() => setShowTranslate((prev) => !prev)}>
            <Languages
              size={25}
              strokeWidth={1.5}
              className="text-green-500 dark:text-white"
            />
          </button>
        </div>

        {showTranslate && (
          <div
            ref={translateRef}
            className="absolute right-2 top-12 z-50 w-[150px] rounded-md bg-white p-2 shadow-md dark:bg-slate-700"
          >
            <ul>
              {options.map((option) => (
                <li
                  key={option.code}
                  className={`flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-1 text-sm capitalize text-black hover:bg-gray-200 dark:text-white dark:hover:bg-slate-600 ${option.code === language ? "bg-gray-200 dark:bg-slate-600" : ""}`}
                  onClick={() => handleTranslate(option)}
                >
                  <img src={option.flag} className="h-5" alt="language flag" />
                  {option.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBar;
