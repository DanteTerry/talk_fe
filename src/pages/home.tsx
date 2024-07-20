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

function Home({ socket }: { socket: Socket }) {
  const callData = {
    socketId: "",
    receivingCall: false,
    callEnded: false,
    name: "",
    picture: "",
    signal: "",
  };

  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [call, setCall] = useState<CallData>(callData);
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callType, setCallType] = useState<"video" | "audio" | null>(null);

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);

  // Join the user to the socket room
  useEffect(() => {
    socket.emit("join", user._id);

    // Listen for online users
    socket.on("get-online-users", async (users) => {
      await dispatch(setOnlineUsers(users));
    });
  }, [dispatch, user._id, socket]);

  // Listen for new messages and typing events
  useEffect(() => {
    socket.on("receive message", (message) => {
      dispatch(updateMessagesAndConversation(message));
    });

    socket.on("typing", () => dispatch(setTyping(true)));

    socket.on("stop typing", () => dispatch(setTyping(false)));
  }, [dispatch, socket]);

  // Set up media devices (video and audio)
  const setUpMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream; // Set video stream to myVideo element
        }
      });
  };

  // Enable media on the video element
  const enableMedia = () => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  };

  // Function to call a user
  const callUser = (callType: "video" | "audio") => {
    enableMedia();

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
        signal: data,
        from: socket.id,
        name: user.name,
        picture: user.picture,
        callType: callType,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream; // Set received stream to userVideo element
      }
    });

    socket.on("call accepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal); // Signal the peer with the received signal
    });

    connectionRef.current = peer; // Save the peer connection
  };

  // Function to answer a call
  const answerCall = () => {
    enableMedia();

    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answer call", { signal: data, to: call.socketId });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream; // Set received stream to userVideo element
      }
    });

    peer.signal(call.signal); // Signal the peer with the received signal

    connectionRef.current = peer; // Save the peer connection
  };

  // Set up socket listeners for call events
  useEffect(() => {
    setUpMedia();

    socket.on("setup socket", (id) => {
      setCall({ ...call, socketId: id });
    });

    socket.on("call user", (data) => {
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
                answerCall={answerCall}
              />
            )}
          </div>
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
