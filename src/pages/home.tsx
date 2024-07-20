import { Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import Chat from "../components/Chat";
import { useSelector } from "react-redux";
import HomeInfo from "../components/HomeInfo";
import SocketContext from "../context/SocketContext";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateMessagesAndConversation } from "../features/chatSlice";
import { setOnlineUsers } from "../features/onlineUserSlice";
import { setTyping } from "../features/typingSlice";
import Call from "../components/call/Call";
import Peer from "simple-peer";
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../lib/utils/utils";
import { Socket } from "socket.io-client";
import { CallData } from "../types/types";
import Ringing from "../components/call/Ringing";
import { set } from "react-hook-form";

function Home({ socket }: { socket: Socket }) {
  const callData = {
    socketId: "",
    receivingCall: false,
    callEnded: false,
    name: "",
    picture: "",
    signal: null,
  };

  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [call, setCall] = useState<CallData>(callData);
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [callAccepted, setCallAccepted] = useState(false);

  const [callType, setCallType] = useState<"video" | "audio" | null>(null);

  const myVideo = useRef();
  const userVideo = useRef();

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

  const setUpMedia = async () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }

        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });
  };

  // call user
  const callUser = (callType) => {
    if (myVideo.current) {
      myVideo.current.srcObject = stream;
    }

    setCall({
      ...call,
      name: getConversationName(user, activeConversation.users),
      picture: getConversationPicture(user, activeConversation.users),
    });

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    setCallType(callType);
    peer.on("signal", (data) => {
      socket.emit("call user", {
        userToCall: getConversationId(user, activeConversation.users),
        signalData: data,
        from: user._id,
        name: user.name,
        picture: user.picture,
        callType: callType,
      });
    });
  };

  // call
  useEffect(() => {
    setUpMedia();

    socket.on("setup socket", (id) => {
      setCall({ ...call, socketId: id });
    });

    socket.on("call user", (data) => {
      console.log(data);
      setCall({
        ...call,
        socketId: data.from,
        name: data.name,
        picture: data.picture,
        receivingCall: true,
        signal: data.signal,
      });
      setCallType(data.callType);
    });
  }, [call, socket]);

  return (
    <div className="h-screen overflow-hidden dark:bg-[#17181B]">
      <div className="flex h-full">
        <SideMenu />
        <div className="grid h-full w-full grid-cols-12">
          <div className="col-span-3 h-[99.5vh] w-full overflow-hidden border-l-2 border-r-2 py-5 dark:border-gray-700 dark:bg-[#17181B]">
            <Outlet />
          </div>
          <div className="relative col-span-9 w-full">
            {activeConversation.name ? (
              <Chat callUser={callUser} setCallType={setCallType} />
            ) : (
              <HomeInfo />
            )}

            {(callType === "video" || callType === "audio") && (
              <Call
                call={call}
                userVideo={userVideo}
                myVideo={myVideo}
                setCall={setCall}
                callAccepted={callAccepted}
                stream={stream}
                callType={callType}
              />
            )}

            {receivingCall && !callEnded && (
              <Ringing call={call} setCall={setCall} callType={callType} />
            )}
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
