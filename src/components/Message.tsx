import { timeHandler } from "../lib/utils/utils";
import { Message as IMessage } from "../types/types";

function Message({ message, me }: { message: IMessage; me: boolean }) {
  return (
    <>
      {me ? (
        <div className="flex justify-end gap-3">
          <div className="flex flex-col gap-1">
            <div className="w-max rounded-md bg-green-500 px-3 py-1 text-lg text-white dark:text-white">
              <p className="flex gap-2">
                {message.message}{" "}
                <span className="self-end text-xs">
                  {timeHandler(message.createdAt)}
                </span>
              </p>
            </div>
          </div>
          <div className="h-5!important w-5 self-end rounded-full">
            <img
              src={message.sender.picture}
              alt="user avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="h-5!important w-5 self-end rounded-full">
            <img
              src="https://gravatar.com/avatar/d6771c28560592154cf60f8bea68d484?s=400&d=retro&r=x"
              alt="user avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="bg-white-500 w-max rounded-md bg-black/90 px-3 py-1 text-lg dark:bg-white dark:text-black">
              <p className="flex gap-2">
                Hello world <span className="self-end text-xs">2:30 AM</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Message;
