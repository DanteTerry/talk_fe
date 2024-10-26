import { useDispatch } from "react-redux";
import { logout } from "../features/userSlice";
import { useSelector } from "react-redux";
import { LogOut } from "lucide-react";
import { RootState } from "../app/store";
import {
  removeConversation,
  removeMessages,
  setActiveConversation,
} from "../features/chatSlice";

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div className="flex h-[82vh] w-full flex-col items-center gap-5 p-4">
      <h1 className="text-2xl font-semibold text-green-500 dark:text-white">
        Profile
      </h1>
      <div className="flex h-full w-full flex-col items-center justify-center gap-5">
        <div className="w-1/2 rounded-full lg:w-2/4">
          <img
            src={user?.picture}
            className="w-full rounded-full object-cover"
            alt="profile"
          />
        </div>
        <div className="flex w-full flex-col items-center gap-1">
          <h1 className="text-2xl font-bold text-green-500 dark:text-white">
            {user?.name}
          </h1>
          <p className="text-lg text-green-500 dark:text-white">
            {user?.email}
          </p>

          <div className="mt-2 flex gap-3">
            <button
              className="flex items-center gap-2 rounded-md bg-green-500 px-2 py-1 text-green-500 dark:text-white"
              onClick={() => {
                dispatch(removeMessages([]));
                dispatch(removeConversation([]));
                dispatch(setActiveConversation(null));
                dispatch(logout());
              }}
            >
              Sign Out <LogOut color="white" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
