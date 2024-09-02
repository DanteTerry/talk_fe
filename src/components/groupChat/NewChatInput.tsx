import { useSelector } from "react-redux";
import MultipleSelect from "./MultipleSelect";
import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { searchResult, User } from "../../types/types";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import {
  createGroupConversation,
  getConversation,
} from "../../features/chatSlice";
import { AppDispatch, RootState } from "../../app/store";

const SEARCH_USER_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/user`;

function NewChatInput({
  setShow,
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
  const { user } = useSelector((state: RootState) => state.user);
  const { status } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch<AppDispatch>();

  const [searchResults, setSearchResults] = useState<searchResult[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<searchResult[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = async (e: any) => {
    if (e.target.value && e.key === "Enter") {
      setSearchResults([]);
      // search for user
      try {
        const { data } = await axios.get(
          `${SEARCH_USER_ENDPOINT}?search=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        if (data.length > 0) {
          const tempArray: searchResult[] = [];

          data.forEach((user: User) => {
            tempArray.push({
              value: user._id,
              label: user.name,
              picture: user.picture,
            });
          });

          setSearchResults(tempArray);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        setSearchResults([]);
        console.log(error);
      }
    }
  };

  const createGroupHandler = async () => {
    if (status !== "loading") {
      setLoading(true);
      const users: string[] = selectedUsers.map(
        (user: searchResult) => user.value,
      );
      const values = {
        name,
        users,
        token: user.token,
      };

      const newConversation = await dispatch(createGroupConversation(values));

      if (
        newConversation?.payload &&
        typeof newConversation.payload !== "string"
      ) {
        setLoading(false);
        setShow(false);
        dispatch(getConversation(user.token));
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <div className="z-50 h-full w-full">
      <div className="flex flex-col items-center gap-5">
        <input
          type="text"
          className="relative w-full rounded-md bg-[#f0f2f5] px-4 py-2 text-green-500 focus:outline-none dark:bg-[#202124]"
          placeholder="Group name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        {/* multiple select */}
        <MultipleSelect
          status={status}
          searchResults={searchResults}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          handleSearch={handleSearch}
        />

        <button
          className="flex w-full items-center justify-center gap-1 rounded-md bg-green-500 p-2 text-center font-bold text-white hover:bg-green-600 hover:transition-all hover:duration-300"
          onClick={createGroupHandler}
        >
          {loading ? <ClipLoader size={22} color="white" /> : "Create Group"}
        </button>
      </div>
    </div>
  );
}

export default NewChatInput;
