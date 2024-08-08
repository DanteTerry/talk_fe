import { MoveRight, Search } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { UserProfile } from "../types/types";
import Friend from "./Friend";

function Friends() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { friends } = useSelector((state) => state.friends);

  const filteredFriends = friends.filter((user: UserProfile) => {
    return (
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <div className="h-full w-full py-5 sm:px-2 md:px-4 xl:px-6">
      <div className="relative mb-5 flex flex-col gap-3 border-b-2 pb-5 dark:border-gray-700">
        <input
          type="text"
          className="relative w-full rounded-md bg-[#f0f2f5] px-2 py-2 pl-10 text-green-500 focus:outline-none dark:bg-[#202124]"
          placeholder="Search friends by email or name"
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
          onClick={() => setSearchText("")}
          size={20}
          className={`absolute left-3 top-[10px] cursor-pointer text-gray-400 ${isFocused === true || searchText.length > 0 ? "rotate-180 animate-rotate180 text-green-500 opacity-100" : "animate-reverse180 opacity-0"}`}
        />
      </div>

      {filteredFriends.length > 0 &&
        filteredFriends.map((user: UserProfile) => {
          return <Friend key={user?._id} user={user} />;
        })}

      {searchText.length === 0 && friends.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3">
          <h1 className="text-2xl font-semibold text-green-500 dark:text-white">
            Search for a user
          </h1>
        </div>
      )}
    </div>
  );
}

export default Friends;
