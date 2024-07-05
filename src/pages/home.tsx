import { Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import Chat from "../components/Chat";
import { useSelector } from "react-redux";
import HomeInfo from "../components/HomeInfo";
import SocketContext from "../context/SocketContext";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateMessagesAndConversation } from "../features/chatSlice";
import { setOnlineUsers } from "../features/onlineUserSlice";

function Home({ socket }) {
  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Join the user to the socket room
  useEffect(() => {
    socket.emit("join", user._id);
    // get all user online
    socket.on("get-online-users", async (users) => {
      await dispatch(setOnlineUsers(users));
    });
  }, [user, socket, dispatch]);

  //listing for new messages
  useEffect(() => {
    socket.on("receive message", (message) => {
      dispatch(updateMessagesAndConversation(message));
    });
  }, []);

  return (
    <div className="h-screen overflow-hidden dark:bg-[#17181B]">
      <div className="flex h-full">
        <SideMenu />
        <div className="grid h-full w-full grid-cols-12">
          <div className="col-span-3 h-[99.5vh] w-full overflow-hidden border-l-2 border-r-2 py-5 dark:border-gray-700 dark:bg-[#17181B]">
            <Outlet />
          </div>
          <div className="col-span-9">
            {activeConversation.name ? <Chat /> : <HomeInfo />}
          </div>
          {/* <div className="col-span-3 bg-blue-600">options</div */}
        </div>
      </div>
    </div>
  );
}

const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HomeWithSocket;
