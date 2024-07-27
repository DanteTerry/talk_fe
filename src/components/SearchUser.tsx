import { MoveRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import SingleUser from "./SingleUser";
import { useSelector } from "react-redux";
import axios from "axios";
import { UserProfile } from "../types/types";

const SEARCH_USER_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/user`;

function SearchUser() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const { token } = useSelector((state) => state.user.user);

  useEffect(() => {
    const getUser = async (searchText: string) => {
      if (searchText.length === 0) {
        setUsers([]);
        return;
      }

      try {
        const { data } = await axios.get(
          `${SEARCH_USER_ENDPOINT}?search=${searchText}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (data) {
          setUsers(data);
        }
      } catch (error) {
        setUsers([]);
        console.log(error);
      }
    };

    getUser(searchText);
  }, [searchText, token]);

  return (
    <div className="h-full w-full px-6 py-5">
      <div className="relative mb-5 flex flex-col gap-3 border-b-2 pb-5 dark:border-gray-700">
        <input
          type="text"
          className="relative w-full rounded-md bg-[#f0f2f5] px-2 py-2 pl-10 text-green-500 focus:outline-none dark:bg-[#202124]"
          placeholder="Search talk"
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

      {users.length > 0 &&
        users.map((user: UserProfile) => {
          return <SingleUser key={user?._id} user={user} />;
        })}

      {searchText.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3">
          <h1 className="text-2xl font-semibold text-green-500 dark:text-white">
            Search for a user
          </h1>
          <p className="text-[14px] text-gray-500 dark:text-gray-400">
            Search for a user to start a conversation
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchUser;
