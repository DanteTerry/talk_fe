import { useDispatch } from "react-redux";
import { setActiveFriend, setFriends } from "../features/friendSlice";
import { MessageCircleMore, MoveLeft, UserMinus } from "lucide-react";
import { useSelector } from "react-redux";
import {
  emptyMessages,
  openCreateConversation,
  setActiveConversation,
} from "../features/chatSlice";
import { AppDispatch, RootState } from "../app/store";
import { getFriends, removeFriend } from "../lib/utils/utils";

function ProfileInfo() {
  const dispatch = useDispatch<AppDispatch>();
  const { activeFriend } = useSelector((state: RootState) => state.friends);
  const { token, _id } = useSelector((state: RootState) => state.user.user);
  const value = {
    receiver_id: activeFriend && (activeFriend?._id as string),
    isGroup: false,
    token,
  };

  const createOrOpenConversation = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await dispatch(emptyMessages() as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await dispatch(openCreateConversation(value as any));
  };

  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);

  const dataToRemoveFriend = {
    userId: _id || "",
    friendId: activeFriend?._id || "",
  };

  const handleRemoveFriend = async () => {
    await removeFriend(token, dataToRemoveFriend);
    const friends = await getFriends(token, _id);
    if (friends?.success) {
      dispatch(setFriends(friends?.friends));
      dispatch(setActiveFriend(null));
      dispatch(setActiveConversation(null));
    }
  };

  return (
    <div
      className={`h-full w-full items-center justify-center dark:text-white ${isDarkMode ? "chatDarkBg" : "chatDarkLight"}`}
    >
      <div className="flex w-full bg-white px-2 py-2 dark:bg-green-500">
        <button
          onClick={() => {
            dispatch(setActiveFriend(null));
            dispatch(setActiveConversation(null));
          }}
        >
          <MoveLeft size={25} className="text-green-500 dark:text-white" />
        </button>
        <h1 className="mx-auto text-2xl text-green-500 dark:text-white">
          Friend's Profile
        </h1>
      </div>
      <div className="my-auto flex h-[82vh] w-full flex-col items-center justify-center gap-5">
        <div className="w-1/2 rounded-full lg:w-1/4">
          <img
            src={activeFriend?.picture}
            className="w-full rounded-full object-cover"
            alt="friend's profile"
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold text-green-500 dark:text-white">
            {activeFriend?.name}
          </h1>

          <p className="text-lg text-green-500 dark:text-white">
            {activeFriend?.email}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className="rounded-lg bg-green-500 px-2 py-2 text-white"
            onClick={createOrOpenConversation}
          >
            <MessageCircleMore size={30} />
          </button>

          <button
            onClick={handleRemoveFriend}
            className="rounded-lg bg-green-500 px-2 py-2 text-white"
          >
            <UserMinus size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
