import { Info, Phone, Video } from "lucide-react";
import { Conversation } from "../types/types";

function ChatBar({ conversation }: { conversation: Conversation }) {
  return (
    <div className="row-span-1 flex items-center justify-between border-b-2 px-6 shadow-sm dark:border-gray-700 dark:bg-green-500">
      <div className="flex items-center gap-3">
        <div className="h-10!important w-10 rounded-full">
          <img
            src={conversation?.picture}
            alt="user avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <p className="text-lg font-bold text-green-500 dark:text-white">
          {conversation?.name}
        </p>
      </div>

      <div className="flex items-center gap-10">
        <div className="cursor-pointer">
          <Phone
            size={24}
            strokeWidth={1.5}
            className="course-pointer text-green-500 dark:text-white"
          />
        </div>
        <div className="cursor-pointer">
          <Video
            size={30}
            strokeWidth={1.5}
            className="text-green-500 dark:text-white"
          />
        </div>

        <div className="cursor-pointer">
          <Info
            size={30}
            strokeWidth={1.5}
            className="text-green-500 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}

export default ChatBar;
