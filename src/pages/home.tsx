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
  getOtherSocketUser,
  getUsersInConversation,
  translateMessage,
} from "../lib/utils/utils";
import { Socket } from "socket.io-client";
import Ringing from "../components/call/Ringing";
import BottomMenu from "../components/BottomMenu";
import Inputs from "../components/Inputs";

function Home({ socket }: { socket: Socket }) {
  const callData = {
    socketId: "",
    receivingCall: false,
    callEnded: false,
    name: "",
    picture: "",
    signal: "",
    usersInCall: [],
  };

  const [emojiPicker, setEmojiPicker] = useState(false);
  const [sendMessage, setSendMessage] = useState("");

  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [call, setCall] = useState(callData);
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callType, setCallType] = useState<"video" | "voice" | "">("");

  const onlineUsers = useSelector((state) => state.onlineUsers);
  const { files } = useSelector((state: any) => state.chat);

  const [videoAndAudio, setVideoAndAudio] = useState({
    video: true,
    audio: true,
  });

  const [audioCallTo, setAudioCallTo] = useState({
    name: "",
    picture: "",
  });
  const [remoteUserVideo, setRemoteUserVideo] = useState(true);
  const [remoteUserAudio, setRemoteUserAudio] = useState(true);
  const { token } = useSelector((state: any) => state.user);
  const { receivingCall } = call;

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);

  const { language } = useSelector((state: any) => state.translate);

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
    socket.on("receive message", async (message) => {
      const data = {
        message,
        lang: language,
      };
      const translatedMessage = await translateMessage(data, token);
      dispatch(updateMessagesAndConversation(translatedMessage));
    });

    socket.on("typing", () => dispatch(setTyping(true)));

    socket.on("stop typing", () => dispatch(setTyping(false)));
  }, [dispatch, socket, language, token]);

  // Set up media devices (video and audio)
  const setUpMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ video: videoAndAudio.video, audio: videoAndAudio.audio })
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
      myVideo.current.srcObject = stream; // Set video stream to myVideo element
    }
  };

  // Function to call a user
  const callUser = (callType: "video" | "voice") => {
    enableMedia();
    const usersInConversation = getUsersInConversation(
      [user._id, getConversationId(user, activeConversation.users)],
      onlineUsers,
    );

    setCall({
      ...call,
      callEnded: false,
      receivingCall: false,
      usersInCall: usersInConversation,
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
        usersInCall: usersInConversation,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream; // Set received stream to userVideo element
      }
    });

    socket.on("call accepted", (signal) => {
      setCallAccepted(true);
      setCall({
        ...call,
        receivingCall: false,
        callEnded: false,
        usersInCall: signal.usersInCall,
      });

      setAudioCallTo({
        name: signal.userName,
        picture: signal.userPicture,
      });

      peer.signal(signal.data); // Signal the peer with the received signal
    });

    connectionRef.current = peer; // Save the peer connection

    peer.on("close", () => {
      socket.off("call accepted");
    });
  };

  const socketId = getOtherSocketUser(user, call?.usersInCall);

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });

      setVideoAndAudio((prevState) => ({
        ...prevState,
        video: !prevState.video,
      }));

      // Notify the other user
      socket.emit("toggle-video", {
        userId: socketId,
        enabled: !videoAndAudio.video,
      });
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoAndAudio((prevState) => ({
        ...prevState,
        audio: !prevState.audio,
      }));

      // Notify the other user
      socket.emit("toggle-audio", {
        userId: socketId,
        enabled: !videoAndAudio.audio,
      });
    }
  };

  useEffect(() => {
    socket.on("toggle-video", ({ userId, enabled }) => {
      if (userVideo.current) {
        userVideo.current.srcObject?.getVideoTracks().forEach((track) => {
          track.enabled = enabled;
        });
        if (enabled) {
          userVideo.current.srcObject = stream; // Set received stream to userVideo element
        }
      }

      setRemoteUserVideo(enabled);
    });

    socket.on("toggle-audio", ({ userId, enabled }) => {
      if (userVideo.current) {
        // Mute or unmute the audio element based on the `enabled` value
        userVideo.current?.srcObject
          ?.getAudioTracks()
          .forEach((track) => (track.enabled = enabled));
      }

      setRemoteUserAudio(enabled);
    });

    return () => {
      socket.off("toggle-video");
      socket.off("toggle-audio");
    };
  }, [socket, socketId, stream]);

  // Function to answer a call
  const answerCall = () => {
    enableMedia();

    setCallAccepted(true);
    setCall({
      ...call,
      receivingCall: false,
      callEnded: false,
      usersInCall: call.usersInCall,
    });

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answer call", {
        signal: data,
        to: call.socketId,
        usersInCall: call.usersInCall,
        userName: user.name,
        userPicture: user.picture,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream; // Set received stream to userVideo element
      }
    });

    peer.signal(call.signal); // Signal the peer with the received signal

    connectionRef.current = peer; // Save the peer connection
  };

  const endCall = () => {
    if (connectionRef.current) {
      connectionRef.current.destroy(); // Destroy the peer connection
      connectionRef.current = null;
    }

    if (myVideo.current) {
      myVideo.current.srcObject = null; // Clear my video stream
    }

    socket.emit("end call", {
      userId: call.socketId,
      usersInCall: call.usersInCall,
    });

    // Reset state variables
    setCall({
      ...call,
      callEnded: true,
      receivingCall: false,
      usersInCall: [],
    });
    setVideoAndAudio({
      video: true,
      audio: true,
    });
    setCallAccepted(false);
    setCallType("");
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
        callEnded: false,
        socketId: data.from,
        name: data.name,
        picture: data.picture,
        receivingCall: true,
        signal: data.signal,
        usersInCall: data.usersInCall,
      });

      setAudioCallTo({
        name: data.to,
        picture: data.toPicture,
      });
      setCallType(data.callType);
    });

    socket.on("end call", (data) => {
      if (myVideo.current) {
        myVideo.current.srcObject = null; // Set my video stream to null
      }

      if (callAccepted) {
        connectionRef?.current?.destroy(); // Destroy the peer
      }
      setCallAccepted(false);
      setCall({
        ...call,
        callEnded: true,
        receivingCall: false,
        usersInCall: [],
      });

      setVideoAndAudio({
        video: true,
        audio: true,
      });
      setCallType("");
    });

    window.addEventListener("beforeunload", () => {
      endCall();

      socket.emit("end call", {
        userId: call.socketId,
        usersInCall: call.usersInCall,
      });
    });

    return () => {
      socket.off("setup socket");
      socket.off("call user");
      socket.off("end call");
      window.removeEventListener("beforeunload", () => {
        endCall();

        socket.emit("end call", {
          userId: call.socketId,
          usersInCall: call.usersInCall,
        });
      });
    };
  }, [call, callAccepted, socket, videoAndAudio]);

  return (
    <div className="h-screen overflow-hidden dark:bg-[#17181B]">
      <div className="flex h-full">
        <SideMenu />
        <div className="grid h-full w-full grid-cols-12">
          <div
            className={`h-[99.5vh] w-full overflow-hidden border-l-2 border-r-2 py-5 dark:border-gray-700 dark:bg-[#17181B] ${activeConversation._id ? "hidden lg:col-span-3 lg:block" : "col-span-12 px-2 lg:col-span-3 lg:px-0"}`}
          >
            <Outlet />
          </div>
          <BottomMenu call={call} />
          <div
            className={`relative w-full ${activeConversation._id ? "col-span-12 lg:col-span-9" : "sm:col-span-9"}`}
          >
            {activeConversation.name ? (
              <>
                <Chat
                  callUser={callUser}
                  setCallType={setCallType}
                  sendMessage={sendMessage}
                  setSendMessage={setSendMessage}
                  setEmojiPicker={setEmojiPicker}
                  emojiPicker={emojiPicker}
                />
                {!files.length ? (
                  <Inputs
                    sendMessage={sendMessage}
                    setSendMessage={setSendMessage}
                    setEmojiPicker={setEmojiPicker}
                    emojiPicker={emojiPicker}
                  />
                ) : null}
              </>
            ) : (
              <HomeInfo />
            )}
          </div>
          {(callType === "video" || callType === "voice") && !receivingCall && (
            <Call
              call={call}
              userVideo={userVideo}
              myVideo={myVideo}
              setCall={setCall}
              callAccepted={callAccepted}
              stream={stream}
              callType={callType}
              answerCall={answerCall}
              endCall={endCall}
              setVideoAndAudio={setVideoAndAudio}
              videoAndAudio={videoAndAudio}
              toggleVideo={toggleVideo}
              toggleAudio={toggleAudio}
              remoteUserVideo={remoteUserVideo}
              remoteUserAudio={remoteUserAudio}
              audioCallTo={audioCallTo}
            />
          )}

          {receivingCall && (
            <Ringing
              call={call}
              setCall={setCall}
              callType={callType}
              answerCall={answerCall}
              endCall={endCall}
            />
          )}
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
