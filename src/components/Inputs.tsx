import { Mic, Paperclip, SendHorizonal, Smile, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessages } from "../features/chatSlice";
import FileSender from "./FileSender";
import SocketContext from "../context/SocketContext";
import { ClipLoader } from "react-spinners";

function Inputs({
  sendMessage,
  setSendMessage,
  emojiPicker,
  setEmojiPicker,
  socket,
}: {
  setEmojiPicker: Dispatch<SetStateAction<boolean>>;
  emojiPicker: boolean;
  sendMessage: string;
  setSendMessage: Dispatch<SetStateAction<string>>;
  socket: any;
}) {
  const dispatch = useDispatch();
  const { activeConversation, status } = useSelector(
    (state: any) => state.chat,
  );
  const { token } = useSelector((state: any) => state.user.user);
  const { files } = useSelector((state: any) => state.chat);
  const [typing, setTyping] = useState(false);
  const [filesSender, setFilesSender] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (files.length > 0) {
      setFilesSender(false);
    }
  }, [files]);

  const values = {
    sendMessage,
    conversation_id: activeConversation._id,
    files: [],
    token,
  };

  const sendMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sendMessage.trim()) return;

    setLoading(true);
    const newMessage = await dispatch(sendMessages(values));
    socket.emit("send message", newMessage.payload);
    setSendMessage("");
    setLoading(false);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSendMessage(value);

    if (value.trim() === "") {
      if (typing) {
        socket.emit("stop typing", activeConversation._id);
        setTyping(false);
      }
    } else {
      if (!typing) {
        setTyping(true);
        socket.emit("typing", activeConversation._id);
      }
      const lastTypingTime = new Date().getTime();
      const timer = 3000;

      setTimeout(() => {
        const timeNow = new Date().getTime();
        const timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timer && typing) {
          socket.emit("stop typing", activeConversation._id);
          setTyping(false);
        }
      }, timer);
    }
  };

  return (
    <form
      className="fixed bottom-0 row-span-1 flex w-full items-center justify-between gap-5 border-t-2 px-5 py-3 dark:border-gray-700"
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
          ref={inputRef}
        />
        <div className="flex cursor-pointer">
          <Mic
            size={25}
            strokeWidth={1.5}
            className="course-pointer absolute right-14 top-2 text-green-500"
          />
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
      {filesSender && <FileSender filesSender={filesSender} />}
    </form>
  );
}

const InputsWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Inputs {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default InputsWithContext;
