import { timeHandler } from "../lib/utils/utils";
import { Message as IMessage } from "../types/types";

function Message({
  message,
  me,
  messages,
  index,
}: {
  message: IMessage;
  me: boolean;
  messages: IMessage[];
  index: number;
}) {
  return (
    <div className={`flex ${me ? "justify-end" : "items-center"} gap-3`}>
      {!me && message?.sender?.name !== messages[index + 1]?.sender?.name ? (
        <div className="h-5 w-5 self-end rounded-full">
          <img
            src={message.sender.picture}
            alt="user avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      ) : (
        <div className="h-5 w-5 self-end rounded-full"></div>
      )}
      <div
        className={`flex flex-col gap-1 ${message?.sender?.name !== messages[index + 1]?.sender?.name && "mb-1"}`}
      >
        <div
          className={`w-max rounded-md px-3 py-1 text-lg ${me ? "bg-green-500 text-white" : "bg-black/90 text-white dark:bg-white dark:text-black"}`}
        >
          <p className="flex max-w-[290px] gap-2 text-justify leading-tight tracking-tight md:w-full">
            {message.message}
            <span className="self-end text-xs">
              {timeHandler(message.createdAt)}
            </span>
          </p>
        </div>
      </div>
      {me && message?.sender?.name !== messages[index + 1]?.sender?.name ? (
        <div className="h-5 w-5 self-end rounded-full">
          <img
            src={message.sender.picture}
            alt="user avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      ) : (
        <div className="h-5 w-5 self-end rounded-full"></div>
      )}
    </div>
  );
}

export default Message;
