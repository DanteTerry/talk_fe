import { useDispatch } from "react-redux";
import { setActiveFriend } from "../features/friendSlice";
import {
  MessageCircleMore,
  MoveLeft,
  Phone,
  UserMinus,
  Video,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  emptyMessages,
  openCreateConversation,
  setActiveConversation,
} from "../features/chatSlice";
import { Dispatch, SetStateAction } from "react";
import { AppDispatch, RootState } from "../app/store";

function ProfileInfo({
  callUser,
  setCallType,
}: {
  callUser: (callType: "video" | "voice") => void;
  setCallType: Dispatch<SetStateAction<"video" | "voice" | "">>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { activeFriend } = useSelector((state: RootState) => state.friends);
  const { token } = useSelector((state: RootState) => state.user.user);
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

  // Todo create rendering of call button based on onlineUser
  // const onlineUsers = useSelector((state: RootState) => state.onlineUsers);
  // const isOnline = onlineUsers.find(
  //   (user: onlineUser) => user.userId === activeFriend?._id,
  // );

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
            {activeFriend?.status}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className="rounded-lg bg-green-500 px-2 py-2 text-white"
            onClick={createOrOpenConversation}
          >
            <MessageCircleMore size={30} />
          </button>
          {false && (
            <>
              <button
                onClick={() => {
                  setCallType("voice");
                  callUser("voice");
                }}
                className="rounded-lg bg-green-500 px-2 py-2 text-white"
              >
                <Phone size={30} />
              </button>
              <button
                onClick={() => {
                  setCallType("video");
                  callUser("video");
                }}
                className="rounded-lg bg-green-500 px-2 py-2 text-white"
              >
                <Video size={30} />
              </button>
            </>
          )}
          <button className="rounded-lg bg-green-500 px-2 py-2 text-white">
            <UserMinus size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
