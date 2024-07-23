import { MoveRight, Plus, Search } from "lucide-react";
import { useState } from "react";

import NewChatInput from "./NewChatInput";

function GroupChat() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [show, setShow] = useState(true);

  return (
    <div className="h-full w-full px-6 py-5">
      <div className="relative mb-5 flex flex-col gap-3 border-b-2 pb-5 dark:border-gray-700">
        <input
          type="text"
          className="relative w-full rounded-md bg-[#f0f2f5] px-2 py-2 pl-10 text-green-500 focus:outline-none dark:bg-[#202124]"
          placeholder="Search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
        <Search
          size={20}
          className={`absolute left-3 top-[10px] text-gray-400 ${isFocused === false && searchText.length === 0 ? "opacity-100" : "animate-rotate180 opacity-0"}`}
        />
        <MoveRight
          size={20}
          className={`absolute left-3 top-[10px] text-gray-400 ${isFocused === true || searchText.length > 0 ? "rotate-180 animate-rotate180 text-green-500 opacity-100" : "animate-reverse180 opacity-0"}`}
        />

        <button
          className="flex w-full items-center justify-center gap-1 rounded-md bg-green-500 p-2 text-center font-bold text-white hover:bg-green-600 hover:transition-all hover:duration-300"
          onClick={() => setShow((prev) => !prev)}
        >
          <Plus size={20} strokeWidth={2.5} />
          New Group chat
        </button>
      </div>

      {show && <NewChatInput setShow={setShow} />}
    </div>
  );
}

export default GroupChat;
