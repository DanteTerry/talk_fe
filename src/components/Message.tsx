import { useState } from "react";
import { MoveRight, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Conversations from "./Conversations";

function Message() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState("");

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

        <Link to="/search" className="w-full">
          <button className="flex w-full items-center justify-center gap-1 rounded-md bg-green-500 p-2 text-center font-bold text-white">
            <Plus size={20} strokeWidth={2.5} />
            New Chat
          </button>
        </Link>
      </div>

      <Conversations searchText={searchText} />
    </div>
  );
}

export default Message;
