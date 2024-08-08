import { trimString } from "../lib/utils/utils";
import { UserProfile } from "../types/types";

function Friend({ user }: { user: UserProfile }) {
  return (
    <div className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-md bg-green-500 px-2 py-3 dark:bg-white">
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
            {trimString(user?.status)}
          </span>
        </div>
        <span className="font-semibold capitalize">friends</span>
      </div>
    </div>
  );
}

export default Friend;
