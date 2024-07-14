import { Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import Chat from "../components/Chat";
import { useSelector } from "react-redux";
import HomeInfo from "../components/HomeInfo";
import SocketContext from "../context/SocketContext";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateMessagesAndConversation } from "../features/chatSlice";
import { setOnlineUsers } from "../features/onlineUserSlice";
import { setTyping } from "../features/typingSlice";
import Call from "../components/call/Call";

function Home({ socket }) {
  const callData = {
    receivingCall: true,
    callEnded: false,
  };

  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [call, setCall] = useState(callData);
  const [callAccepted, setCallAccepted] = useState(false);

  const { receivingCall, callEnded } = call;

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
    // receive message
    socket.on("receive message", (message) => {
      dispatch(updateMessagesAndConversation(message));
    });

    // set typing
    socket.on("typing", () => dispatch(setTyping(true)));

    // remove typing
    socket.on("stop typing", () => dispatch(setTyping(false)));
  }, [dispatch, socket]);

  return (
    <div className="h-screen overflow-hidden dark:bg-[#17181B]">
      <div className="flex h-full">
        <SideMenu />
        <div className="grid h-full w-full grid-cols-12">
          <div className="col-span-3 h-[99.5vh] w-full overflow-hidden border-l-2 border-r-2 py-5 dark:border-gray-700 dark:bg-[#17181B]">
            <Outlet />
          </div>
          <div className="relative col-span-9 w-full">
            {activeConversation.name ? <Chat /> : <HomeInfo />}
            <Call call={call} setCall={setCall} callAccepted={callAccepted} />
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
