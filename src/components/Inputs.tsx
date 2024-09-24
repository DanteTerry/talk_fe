import { Paperclip, SendHorizonal, Smile, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessages } from "../features/chatSlice";
import FileSender from "./FileSender";
import SocketContext from "../context/SocketContext";
import { ClipLoader } from "react-spinners";
import { getConversationId } from "../lib/utils/utils";
import { Socket } from "socket.io-client";
import { AppDispatch, RootState } from "../app/store";
import { UserDataForUtil } from "../types/types";

function Inputs({
  sendMessage,
  setSendMessage,
  emojiPicker,
  setEmojiPicker,
  socket,
  textRef,
}: {
  setEmojiPicker: Dispatch<SetStateAction<boolean>>;
  emojiPicker: boolean;
  sendMessage: string;
  setSendMessage: Dispatch<SetStateAction<string>>;
  socket: Socket;
  textRef: React.RefObject<HTMLInputElement>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { activeConversation, status } = useSelector(
    (state: RootState) => state.chat,
  );
  const { token } = useSelector((state: RootState) => state.user.user);
  const { files } = useSelector((state: RootState) => state.chat);
  const [typing, setTyping] = useState(false);
  const [filesSender, setFilesSender] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (files.length > 0) {
      setFilesSender(false);
    }
  }, [files]);

  const otherUserId = getConversationId(
    user,
    activeConversation?.users as UserDataForUtil[],
  );

  const values = {
    sendMessage,
    conversation_id: activeConversation?._id as string,
    files: [],
    token,
    otherUserId,
  };

  const sendMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sendMessage.trim()) return;

    setLoading(true);
    const newMessage = await dispatch(sendMessages(values));
    socket.emit("send message", newMessage.payload);
    setEmojiPicker(false);
    setSendMessage("");
    setLoading(false);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSendMessage(value);

    if (value.trim() === "") {
      if (typing) {
        socket.emit("stop typing", activeConversation?._id);
        setTyping(false);
      }
    } else {
      if (!typing) {
        setTyping(true);
        socket.emit("typing", activeConversation?._id);
      }
      const lastTypingTime = new Date().getTime();
      const timer = 3000;

      setTimeout(() => {
        const timeNow = new Date().getTime();
        const timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timer && typing) {
          socket.emit("stop typing", activeConversation?._id);
          setTyping(false);
        }
      }, timer);
    }
  };

  return (
    <form
      className="row-span-1 flex max-w-full items-center justify-between gap-5 border-t-2 px-5 py-3 dark:border-gray-700 dark:bg-[#17181B]"
      onSubmit={sendMessageHandler}
    >
      <div className="relative flex gap-4">
        <button
          type="button"
          onClick={() => {
            setEmojiPicker(!emojiPicker);
            setFilesSender(false);
          }}
        >
          {emojiPicker ? (
            <X
              size={24}
              strokeWidth={1.8}
              className="course-pointer text-green-500 dark:text-white"
            />
          ) : (
            <Smile
              size={24}
              strokeWidth={1.8}
              className="course-pointer text-green-500 dark:text-white"
            />
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setFilesSender(!filesSender);
            setEmojiPicker(false);
          }}
        >
          {filesSender ? (
            <X
              size={24}
              strokeWidth={1.8}
              className="course-pointer text-green-500 dark:text-white"
            />
          ) : (
            <Paperclip
              size={24}
              strokeWidth={1.8}
              className="course-pointer text-green-500 dark:text-white"
            />
          )}
        </button>
      </div>

      <div className="relative w-full">
        <input
          type="text"
          className="w-full rounded-md border-2 border-green-500 bg-[#f0f2f5] px-4 py-2 pr-24 text-green-500 focus:outline-none dark:border-none dark:bg-[#202124]"
          placeholder="Type a message..."
          value={sendMessage}
          onChange={onChangeHandler}
          ref={textRef}
        />
        <div className="flex cursor-pointer">
          <button type="submit">
            {status === "loading" && loading ? (
              <ClipLoader
                className="absolute right-4 top-2 text-green-500"
                size={25}
                color="#22c55e"
              />
            ) : (
              <SendHorizonal
                size={25}
                strokeWidth={1.5}
                className="absolute right-4 top-2 text-green-500"
              />
            )}
          </button>
        </div>
      </div>
      {filesSender && <FileSender />}
    </form>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InputsWithContext = (props: any) => (
  <SocketContext.Consumer>
    {(socket) => <Inputs {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default InputsWithContext;
