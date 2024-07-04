import { Loader, Mic, Paperclip, SendHorizonal, Smile, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessages } from "../features/chatSlice";
import { useSelector } from "react-redux";
import FileSender from "./FileSender";

function Inputs({
  sendMessage,
  emojiPicker,
  setSendMessage,
  setEmojiPicker,
}: {
  setEmojiPicker: Dispatch<SetStateAction<boolean>>;
  emojiPicker: boolean;
  textRef: React.RefObject<HTMLInputElement>;
  sendMessage: string;
  setSendMessage: Dispatch<SetStateAction<string>>;
}) {
  const dispatch = useDispatch();
  const { activeConversation, status } = useSelector(
    (state: any) => state.chat,
  );
  const { token } = useSelector((state: any) => state.user.user);
  const [filesSender, setFilesSender] = useState(false);

  const values = {
    sendMessage,
    conversation_id: activeConversation._id,
    files: [],
    token,
  };

  const sendMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sendMessage) return;
    dispatch(sendMessages(values));
    setSendMessage("");
    setEmojiPicker(false);
  };

  return (
    <form
      className="relative row-span-1 flex items-center justify-between gap-5 border-t-2 px-5 dark:border-gray-700"
      onSubmit={(e) => sendMessageHandler(e)}
    >
      <div className="relative flex gap-4">
        {/* //Todo: Fix emoji picker bug*/}
        <button
          onClick={() => {
            setEmojiPicker((state) => !state);
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
          onClick={() => {
            setFilesSender((state) => !state);
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
          className="w-full rounded-md bg-[#f0f2f5] px-4 py-2 pr-24 text-green-500 focus:outline-none dark:bg-[#202124]"
          placeholder="Type a message..."
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
        />
        <div>
          <div className="flex cursor-pointer">
            <Mic
              size={25}
              strokeWidth={1.5}
              className="course-pointer absolute right-14 top-2 text-green-500"
            />
            <button type="submit">
              {status === "loading" ? (
                <Loader
                  size={25}
                  strokeWidth={1.5}
                  className="animate-spin absolute right-4 top-2 cursor-none text-green-500"
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
      </div>
      {filesSender && <FileSender filesSender={filesSender} />}
    </form>
  );
}

export default Inputs;
