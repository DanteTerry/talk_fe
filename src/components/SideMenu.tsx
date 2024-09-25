import chatDarkLogo from "../assets/chatGreen.svg";
import { Bell, BellDot, Sun, SunMoon } from "lucide-react";
import { sidebarItems } from "../constants/constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleDarkMode } from "../features/darkmodeSlice";
import { useSelector } from "react-redux";
import { setActiveConversation } from "../features/chatSlice";
import SocketContext from "../context/SocketContext";
import { Socket } from "socket.io-client";
import { useEffect } from "react";
import { getFriendRequests } from "../lib/utils/utils";
import { setFriendRequests } from "../features/notificationSlice";
import { setActiveFriend } from "../features/friendSlice";
import { RootState } from "../app/store";
import { FriendRequest } from "../types/types";

function SideMenu({ socket }: { socket: Socket }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.user.user);
  const notification = useSelector(
    (state: RootState) => state.notification.friendRequests,
  );

  // Filter notifications for the current user with "pending", "accepted", and "rejected" statuses
  const pendingRequests = notification.friendRequests?.filter(
    (request: FriendRequest) =>
      user._id === request.receiver._id && request.status === "pending",
  );

  const completedRequests = notification.friendRequests?.filter(
    (request: FriendRequest) =>
      // Show accepted requests to only the sender
      (user._id === request.sender._id && request.status === "accepted") ||
      // Show rejected requests only to the sender
      (user._id === request.sender._id && request.status === "rejected"),
  );

  useEffect(() => {
    socket.on("receive-friend-request", async (data) => {
      const value = {
        token,
        id: data.receiver,
      };

      const requests = await getFriendRequests(value);
      if (requests.friendRequests.length > 0) {
        dispatch(setFriendRequests(requests));
      }
    });
  }, [socket, dispatch, user._id, token]);

  useEffect(() => {
    async function getRequest() {
      const value = {
        token,
        id: user._id,
      };
      const friendRequests = await getFriendRequests(value);
      if (friendRequests.friendRequests.length > 0) {
        dispatch(setFriendRequests(friendRequests));
      }
    }

    getRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside className="hidden h-full w-[100px] flex-col items-center justify-between pb-10 dark:bg-[#17181B] lg:flex">
      <button
        onClick={() => {
          dispatch(setActiveConversation(null));
          navigate("/messages");
          dispatch(setActiveFriend(null));
        }}
        className="flex items-end justify-center py-5"
      >
        <img src={chatDarkLogo} className="w-5/6" />
      </button>

      <div className="flex w-full flex-col items-center gap-5">
        {sidebarItems.map((items, index) => {
          return (
            <Link to={`${items.url}`} key={items.name}>
              <div
                key={index}
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${items.name === location.pathname.split("/")[1] && "bg-[#E8EBF9] dark:bg-[#202124]"}`}
              >
                <items.icon
                  size={30}
                  className="text-black dark:text-white"
                  strokeWidth={1.25}
                />
              </div>
            </Link>
          );
        })}

        {pendingRequests?.length === 0 && completedRequests?.length === 0 ? (
          <Link to={"notifications"}>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${location.pathname.split("/")[1] === "notifications" && "bg-[#E8EBF9] dark:bg-[#202124]"}`}
            >
              <Bell
                size={30}
                className="text-black dark:text-white"
                strokeWidth={1.25}
              />
            </div>
          </Link>
        ) : (
          <Link to={"notifications"}>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${location.pathname.split("/")[1] === "notifications" && "bg-[#E8EBF9] dark:bg-[#202124]"}`}
            >
              <BellDot
                size={30}
                className="text-black dark:text-white"
                strokeWidth={1.25}
              />
            </div>
          </Link>
        )}
      </div>

      <div className="flex flex-col items-center gap-8">
        <div
          onClick={() => dispatch(toggleDarkMode())}
          className="cursor-pointer"
        >
          {!darkMode ? (
            <Sun
              size={34}
              strokeWidth={1.25}
              className="text-black dark:text-white"
            />
          ) : (
            <SunMoon
              size={34}
              strokeWidth={1.25}
              className="text-black dark:text-white"
            />
          )}
        </div>
        <Link to="/profile">
          <div className="h-10 w-10 cursor-pointer rounded-full">
            <img
              src={user?.picture}
              alt="user avatar"
              className="w-14!important h-14!important rounded-full object-cover"
            />
          </div>
        </Link>
      </div>
    </aside>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SideMenuWithContext = (props: any) => (
  <SocketContext.Consumer>
    {(socket) => <SideMenu {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default SideMenuWithContext;
