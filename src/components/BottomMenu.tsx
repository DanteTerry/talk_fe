import { Link, useLocation } from "react-router-dom";
import { sidebarItems } from "../constants/constants";
import { useSelector } from "react-redux";
import { Bell, BellDot, Grip, Sun, SunMoon } from "lucide-react";
import { toggleDarkMode } from "../features/darkmodeSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import SocketContext from "../context/SocketContext";
import { setActiveFriend } from "../features/friendSlice";
import { RootState } from "../app/store";
import { CallData, FriendRequest } from "../types/types";

function BottomMenu({ call }: { call: CallData }) {
  const { activeConversation } = useSelector((state: RootState) => state.chat);
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const location = useLocation();

  const darkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

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

  return (
    <div
      className={`fixed bottom-0 z-50 w-full ${call.usersInCall.length > 0 ? "hidden" : "flex"} bg-green-500 px-2 py-3 ${activeConversation?._id ? "hidden" : "flex lg:hidden"}`}
    >
      <div className="relative mx-auto flex w-full items-center justify-evenly">
        {sidebarItems
          .filter((items) => {
            return items.name !== "group-chat";
          })
          .map((items, index) => {
            return (
              <Link
                to={`${items.url}`}
                key={index}
                onClick={() => {
                  dispatch(setActiveFriend(null));
                }}
              >
                <div
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
          <Link
            to={"notifications"}
            onClick={() => {
              dispatch(setActiveFriend(null));
            }}
          >
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
          <Link
            to={"notifications"}
            onClick={() => {
              dispatch(setActiveFriend(null));
            }}
          >
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

        <button className="relative">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${showMenu && "bg-[#E8EBF9] dark:bg-[#202124]"}`}
          >
            <Grip
              size={30}
              strokeWidth={1.25}
              className="text-black dark:text-white"
              onClick={() => setShowMenu((prev) => !prev)}
            />
          </div>
          {showMenu && (
            <div className="absolute bottom-20 rounded-md bg-green-500 px-1 py-1">
              <div className="flex flex-col items-center justify-center gap-2">
                {sidebarItems
                  .filter((items) => {
                    return items.name === "group-chat";
                  })
                  .map((items, index) => {
                    return (
                      <Link to={`${items.url}`} key={index}>
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${items.name === location.pathname.split("/")[1] && "bg-[#E8EBF9] dark:bg-[#202124]"}`}
                        >
                          <items.icon
                            size={30}
                            className="text-black dark:text-white"
                            strokeWidth={1.25}
                            onClick={() => setShowMenu((prev) => !prev)}
                          />
                        </div>
                      </Link>
                    );
                  })}

                <div className="flex flex-col items-center gap-2">
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
                  <Link
                    to="/profile"
                    onClick={() => {
                      dispatch(setActiveFriend(null));
                    }}
                  >
                    <div className="h-10 w-10 cursor-pointer rounded-full">
                      <img
                        src={user?.picture}
                        alt="user avatar"
                        className="h-full w-full rounded-full object-cover"
                        onClick={() => setShowMenu((prev) => !prev)}
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BottomMenuWithContext = (props: any) => (
  <SocketContext.Consumer>
    {(socket) => <BottomMenu {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default BottomMenuWithContext;
