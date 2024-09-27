import { useSelector } from "react-redux";
import Message from "./Message";
import { Message as IMessage } from "../types/types";
import { useEffect, useState } from "react";
import FileMessage from "./fileUploader/FileMessage";
import { ScaleLoader, SyncLoader } from "react-spinners";
import { useInView } from "react-intersection-observer";
import { getConversationMessages, setHasNext } from "../features/chatSlice";
import { useDispatch } from "react-redux";
import { setPage } from "../features/pageSlice";
import { AppDispatch, RootState } from "../app/store";

function ChatMessages({ endRef }: { endRef: React.RefObject<HTMLDivElement> }) {
  const { messages } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.user);
  const typing = useSelector((state: RootState) => state.typing);
  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);
  const { activeConversation } = useSelector((state: RootState) => state.chat);
  const { token } = useSelector((state: RootState) => state.user.user);
  const { language } = useSelector((state: RootState) => state.translate);
  const { hasNext } = useSelector((state: RootState) => state.chat);
  const { page } = useSelector((state: RootState) => state.page);
  const dispatch = useDispatch<AppDispatch>();

  const [showLoader, setShowLoader] = useState(false);
  const [ref, inView] = useInView();

  const values = {
    token,
    conversation_id: activeConversation?._id as string,
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
      dispatch(setPage(page + 1));
      if (page > 1) {
        dispatch(getConversationMessages(values));
      }

      setTimeout(() => {
        setShowLoader(false);
      }, 300);
    } else {
      setShowLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNext, dispatch]);

  // Fetch messages when activeConversation changes
  useEffect(() => {
    if (activeConversation?._id) {
      dispatch(setPage(1));
      dispatch(getConversationMessages(values));

      setTimeout(() => {
        dispatch(setHasNext(true));
      }, 4000);

      dispatch(setPage(1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?._id, dispatch]);

  return (
    <div
      className={`no-scrollbar row-span-9 flex h-[82vh] flex-col gap-[5px] overflow-y-scroll px-2 py-3 text-white scrollbar-track-white scrollbar-thumb-green-500 dark:scrollbar-track-black sm:px-3 md:px-5 ${isDarkMode ? "chatDarkBg" : "chatDarkLight"}`}
    >
      {hasNext && messages.length > 20 && (
        <div className="mx-auto" ref={ref}>
          {showLoader && (
            <ScaleLoader
              color="white"
              className="text-green-500 dark:text-white"
            />
          )}
        </div>
      )}
      {messages?.length > 0 &&
        messages.map((message: IMessage, index: number) => (
          <div key={index}>
            {/* Add a unique key to the parent element */}
            {message?.files?.length > 0 &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              message?.files.map((file: any, index) => (
                <FileMessage
                  key={index}
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
