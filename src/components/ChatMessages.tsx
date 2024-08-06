import { useSelector } from "react-redux";
import Message from "./Message";
import { Message as IMessage } from "../types/types";
import { useEffect, useState } from "react";
import FileMessage from "./fileUploader/FileMessage";
import { ScaleLoader, SyncLoader } from "react-spinners";
import { useInView } from "react-intersection-observer";
import { getConversationMessages, setHasNext } from "../features/chatSlice";
import { useDispatch } from "react-redux";

function ChatMessages({
  endRef,
  page,
  setPage,
}: {
  endRef: React.RefObject<HTMLDivElement>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const typing = useSelector((state) => state.typing);
  const { isDarkMode } = useSelector((state) => state.darkMode);
  const { activeConversation } = useSelector((state: any) => state.chat);
  const { token } = useSelector((state: any) => state.user.user);
  const { language } = useSelector((state: any) => state.translate);
  const { hasNext } = useSelector((state: any) => state.chat);
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [ref, inView] = useInView();

  const values = {
    token,
    conversation_id: activeConversation._id,
    lang: language,
    page,
  };

  // scroll to the end of the chat when a new message is sent
  useEffect(() => {
    if (endRef.current && page === 1) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, page, endRef]);

  useEffect(() => {
    if (inView && hasNext) {
      setShowLoader(true);
      setPage((prev: number) => prev + 1);
      if (page > 1) {
        dispatch(getConversationMessages(values));
      }

      setTimeout(() => {
        setShowLoader(false);
      }, 300);
    } else {
      setPage((prev) => prev);
      setShowLoader(false);
    }
  }, [inView, dispatch]);

  // Fetch messages when activeConversation changes
  useEffect(() => {
    if (activeConversation._id) {
      setPage(1);
      dispatch(getConversationMessages(values));
      setTimeout(() => {
        dispatch(setHasNext(true));
      }, 2000);
    }
  }, [activeConversation, setPage, dispatch]);

  return (
    <div
      className={`no-scrollbar row-span-9 flex h-[82vh] flex-col gap-[5px] overflow-y-scroll px-2 py-3 text-white scrollbar-track-white scrollbar-thumb-green-500 dark:scrollbar-track-black sm:px-3 md:px-5 ${isDarkMode ? "chatDarkBg" : "chatDarkLight"}`}
    >
      {hasNext && (
        <div className="mx-auto" ref={ref}>
          {showLoader && <ScaleLoader color="white" />}
        </div>
      )}
      {messages?.length > 0 &&
        messages.map((message: IMessage, index: number) => (
          <div key={index}>
            {/* Add a unique key to the parent element */}
            {message?.files?.length > 0 &&
              message?.files.map((file) => (
                <FileMessage
                  key={file.file.asset_id}
                  file={file}
                  message={message}
                  me={user._id === message.sender._id}
                  type={file?.type}
                />
              ))}
            {message?.message?.length > 0 && message?.files?.length === 0 && (
              <Message
                message={message}
                key={message._id}
                me={user._id === message.sender._id}
                messages={messages}
                index={index}
              />
            )}
          </div>
        ))}
      {typing && <SyncLoader color="white" className="pt-3" size={8} />}{" "}
      {/* Render typing indicator only when typing */}
      <div className="mt-3" ref={endRef}></div>{" "}
      {/* Render the endRef element only once */}
    </div>
  );
}

export default ChatMessages;
