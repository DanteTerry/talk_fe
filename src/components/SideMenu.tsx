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

function SideMenu({ socket }: { socket: Socket }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode.isDarkMode);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user.user);

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
  }, []);

  const notification = useSelector(
    (state) => state.notification.friendRequests,
  );

  return (
    <aside className="hidden h-full w-[100px] flex-col items-center justify-between pb-10 dark:bg-[#17181B] lg:flex">
      <button
        onClick={() => {
          dispatch(setActiveConversation({}));
          navigate("/messages");
          dispatch(setActiveFriend({}));
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

        {notification?.length === 0 ? (
          <Link to={"notifications"}>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${location.pathname.split("/")[1] === "notification" && "bg-[#E8EBF9] dark:bg-[#202124]"}`}
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
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${location.pathname.split("/")[1] === "notification" && "bg-[#E8EBF9] dark:bg-[#202124]"}`}
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
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </Link>
      </div>
    </aside>
  );
}

const SideMenuWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <SideMenu {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default SideMenuWithContext;
