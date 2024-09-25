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
  createUserLanguage,
  getConversationId,
  getConversationName,
  getConversationPicture,
  getFriendRequests,
  getFriends,
  getOtherSocketUser,
  getUsersInConversation,
  translateMessage,
} from "../lib/utils/utils";
import { Socket } from "socket.io-client";
import Ringing from "../components/call/Ringing";
import BottomMenu from "../components/BottomMenu";
import { setFriendRequests } from "../features/notificationSlice";
import { setFriends } from "../features/friendSlice";
import ProfileInfo from "../components/ProfileInfo";
import { RootState } from "../app/store";

import {
  CallData,
  ToggleAudioPayload,
  ToggleVideoPayload,
  UserDataForUtil,
} from "../types/types";

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

  const { activeConversation } = useSelector((state: RootState) => state.chat);
  const { activeFriend } = useSelector((state: RootState) => state.friends);

  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [call, setCall] = useState<CallData>(callData);
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callType, setCallType] = useState<"video" | "voice" | "">("");

  const onlineUsers = useSelector((state: RootState) => state.onlineUsers);

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
  const { receivingCall } = call;

  const { token } = useSelector((state: RootState) => state.user.user);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const myVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);
  const textRef = useRef<HTMLInputElement>(null);

  const { language } = useSelector((state: RootState) => state.translate);

  useEffect(() => {
    const value = {
      token: user.token,
      language,
      user: user._id,
    };
    if (user.token) {
      createUserLanguage(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const translatedMessage = await translateMessage(data, user.token);
      data.lang = "";
      dispatch(updateMessagesAndConversation(translatedMessage));
    });

    socket.on("typing", () => dispatch(setTyping(true)));

    socket.on("stop typing", () => dispatch(setTyping(false)));
  }, [dispatch, socket, language, user.token]);

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
      [
        user._id,
        getConversationId(user, activeConversation?.users as UserDataForUtil[]),
      ],
      onlineUsers,
    );

    setCall({
      ...call,
      callEnded: false,
      receivingCall: false,
      usersInCall: usersInConversation,
      name: getConversationName(
        user,
        activeConversation?.users as UserDataForUtil[],
      ),
      picture: getConversationPicture(
        user,
        activeConversation?.users as UserDataForUtil[],
      ),
    });

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    setCallType(callType);

    peer.on("signal", (data) => {
      socket.emit("call user", {
        userToCall: getConversationId(
          user,
          activeConversation?.users as UserDataForUtil[],
        ),
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

      peer.signal(signal.data);
    });

    connectionRef.current = peer;

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("toggle-video", ({ enabled }: ToggleVideoPayload) => {
      if (userVideo.current) {
        const mediaStream = userVideo.current.srcObject as MediaStream | null;

        if (mediaStream) {
          mediaStream.getVideoTracks().forEach((track) => {
            track.enabled = enabled;
          });

          if (enabled && stream) {
            userVideo.current.srcObject = stream;
          }
        }
      }

      setRemoteUserVideo(enabled);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("toggle-audio", ({ enabled }: ToggleAudioPayload) => {
      if (userVideo.current) {
        const mediaStream = userVideo.current.srcObject as MediaStream | null;

        if (mediaStream) {
          mediaStream
            .getAudioTracks()
            .forEach((track) => (track.enabled = enabled));
        }
      }

      setRemoteUserAudio(enabled);
    });

    return () => {
      socket.off("toggle-video");
      socket.off("toggle-audio");
    };
  }, [socket, stream]);

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
    setCallAccepted(false);
    if (connectionRef.current) {
      connectionRef.current.destroy(); // Destroy the peer connection
      connectionRef.current = null;
    }
    setCallType("");

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("end call", () => {
      setCallAccepted(false);

      if (callAccepted) {
        connectionRef?.current?.destroy(); // Destroy the peer
      }

      setCallType("");
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

      if (myVideo.current) {
        myVideo.current.srcObject = null; // Set my video stream to null
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call, callAccepted, socket, videoAndAudio]);

  // Listen for friend requests
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

  // Get friend requests from the database
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

  //  Accept friend request
  useEffect(() => {
    socket.on("accepted-friend-request", async () => {
      const friends = await getFriends(token, user._id);
      if (friends?.success) {
        dispatch(setFriends(friends.friends));

        const value = {
          token,
          id: user._id,
        };
        const friendRequests = await getFriendRequests(value);

        if (friendRequests.friendRequests.length > 0) {
          dispatch(setFriendRequests(friendRequests));
        }
      }
    });
  }, [socket, token, dispatch, user._id]);

  //rejected friend request
  useEffect(() => {
    socket.on("rejected-friend-request", async () => {
      const value = {
        token,
        id: user._id,
      };

      const friendRequests = await getFriendRequests(value);

      if (friendRequests.friendRequests.length > 0) {
        dispatch(setFriendRequests(friendRequests));
      }
    });
  }, [socket, token, dispatch, user._id]);

  // Get friends
  useEffect(() => {
    async function getFriendsData() {
      const friends = await getFriends(token, user._id);
      if (friends?.success) {
        dispatch(setFriends(friends?.friends));
      }
    }

    getFriendsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden dark:bg-[#17181B]">
      <div className="flex h-full w-full">
        <SideMenu />
        <div className="grid h-full w-full grid-cols-12">
          <div
            className={`h-[99.5vh] w-full overflow-hidden border-l-2 border-r-2 py-5 dark:border-gray-700 dark:bg-[#17181B] ${activeConversation?._id ? "hidden lg:col-span-3 lg:block" : "col-span-12 px-2 lg:col-span-3 lg:px-0"} ${activeFriend?._id ? "hidden lg:col-span-3 lg:block" : "col-span-12 px-2 lg:col-span-3 lg:px-0"}`}
          >
            <Outlet />
          </div>
          <BottomMenu call={call} />
          <div
            className={`relative w-full ${activeConversation?._id && "col-span-12 lg:col-span-9"} ${activeFriend?._id ? "col-span-12 lg:col-span-9" : "col-span-12 lg:col-span-9"}`}
          >
            {activeConversation?.name ? (
              <div className="relative">
                <Chat
                  callUser={callUser}
                  setCallType={setCallType}
                  sendMessage={sendMessage}
                  setSendMessage={setSendMessage}
                  emojiPicker={emojiPicker}
                  textRef={textRef}
                  setEmojiPicker={setEmojiPicker}
                />
              </div>
            ) : (
              <HomeInfo />
            )}

            {activeFriend?.name ? <ProfileInfo /> : <HomeInfo />}
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HomeWithSocket = (props: any) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HomeWithSocket;
