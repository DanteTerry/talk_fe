import { useDispatch } from "react-redux";
import { User } from "../types/types";
import { trimString } from "../lib/utils/utils";
import { setActiveFriend } from "../features/friendSlice";
import { setActiveConversation } from "../features/chatSlice";
import { AppDispatch } from "../app/store";

function Friend({ user }: { user: User }) {
  const dispatch = useDispatch<AppDispatch>();

  console.log(user);
  const handleClick = () => {
    dispatch(setActiveFriend(user));
    dispatch(setActiveConversation(null));
  };

  return (
    <div
      onClick={handleClick}
      className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-md bg-green-500 px-2 py-3 dark:bg-white"
    >
      <div className="h-12!important w-12 rounded-full">
        <img
          src={user?.picture}
          alt="user avatar"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col justify-between">
          <span className="font-semibold text-white opacity-95 dark:text-black">
            {user?.name}
          </span>
          <span className="text-[13px] font-semibold text-white opacity-95 dark:text-black">
            {trimString(user?.status as string, 25)}
          </span>
        </div>
        <span className="font-semibold capitalize text-white dark:text-green-500">
          friends
        </span>
      </div>
    </div>
  );
}

export default Friend;
