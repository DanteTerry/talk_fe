import { useState } from "react";
import { MoveRight, Search } from "lucide-react";
import SingleConversation from "./SingleConversation";

function Message() {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="h-full w-full px-3 py-5">
      <div className="relative mb-5 border-b-2 pb-5 dark:border-gray-700">
        <input
          type="text"
          className="relative w-full rounded-md bg-[#f0f2f5] px-2 py-2 pl-10 text-green-500 focus:outline-none dark:bg-[#202124]"
          placeholder="Search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Search
          size={20}
          className={`absolute left-3 top-[10px] text-gray-400 ${isFocused === false ? "opacity-100" : "animate-rotate180 opacity-0"}`}
        />
        <MoveRight
          size={20}
          className={`absolute left-3 top-[10px] text-gray-400 ${isFocused === true ? "animate-rotate180 rotate-180 text-green-500 opacity-100" : "animate-reverse180 opacity-0"}`}
        />
      </div>

      <div className="no-scrollbar h-screen overflow-y-scroll">
        <SingleConversation />
        <SingleConversation />
        <SingleConversation />
        <SingleConversation />
        <SingleConversation />
        <SingleConversation />
        <SingleConversation />
        <SingleConversation />
        <SingleConversation />
        <SingleConversation />
        <SingleConversation />
        <SingleConversation />
      </div>
    </div>
  );
}

export default Message;
