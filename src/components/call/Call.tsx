import { CallData } from "../../types/types";
import CallAction from "./CallAction";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import VoiceCallContainer from "./VoiceCallContainer";
import AudioRing from "../../../public/ringing.mp3";
import { MicOff, VideoOff } from "lucide-react";

function Call({
  call,
  callAccepted,
  userVideo,
  myVideo,
  callType,
  stream,
  endCall,
  videoAndAudio,
  toggleVideo,
  toggleAudio,
  remoteUserVideo,
  remoteUserAudio,
  audioCallTo,
}: {
  call: CallData;
  setCall: Dispatch<SetStateAction<CallData>>;
  callAccepted: boolean;
  userVideo: RefObject<HTMLVideoElement>;
  myVideo: RefObject<HTMLVideoElement>;
  stream: MediaStream | undefined;
  callType: "video" | "voice" | null;
  answerCall: () => void;
  endCall: () => void;
  setVideoAndAudio: Dispatch<
    SetStateAction<{ video: boolean; audio: boolean }>
  >;
  videoAndAudio: { video: boolean; audio: boolean };
  toggleVideo: () => void;
  toggleAudio: () => void;
  remoteUserVideo: boolean;
  remoteUserAudio: boolean;
  audioCallTo: { name: string; picture: string };
}) {
  const { callEnded } = call;
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
      <div
        className={`relative flex h-full w-full flex-col justify-between ${callType === "video" ? "md:p-4" : "p-0"}`}
      >
        {/* Container */}
        {callType === "voice" && (
          <VoiceCallContainer
            call={call}
            callAccepted={callAccepted}
            stream={stream}
            audioCallTo={audioCallTo}
            isMuted={isMuted}
            remoteUserAudio={remoteUserAudio}
            userVideo={userVideo}
            myVideo={myVideo}
          />
        )}

        {/* Actions */}
        {(callType === "video" || callType === "voice") && (
          <CallAction
            callType={callType}
            endCall={endCall}
            videoAndAudio={videoAndAudio}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            setIsMuted={setIsMuted}
          />
        )}

        {/* Video Streams */}
        {callType === "video" && (
          <div className="relative flex h-[90vh] w-full items-center justify-center overflow-hidden rounded-lg bg-slate-800">
            {/* User Video */}
            <div className="relative flex h-full w-full rounded-lg bg-black">
              {callAccepted && !callEnded && (
                <video
                  ref={userVideo}
                  className="absolute inset-0 h-full w-full rounded-lg object-cover"
                  playsInline
                  autoPlay
                />
              )}

              {callAccepted && !callEnded && !remoteUserAudio && (
                <div className="absolute right-5 top-5 flex flex-col items-center justify-center gap-2">
                  <MicOff size={25} color="white" />
                </div>
              )}

              {!remoteUserVideo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black opacity-75">
                  <VideoOff size={25} color="gray" />
                  <p className="text-xs font-semibold text-gray-400">
                    User camera is turned off
                  </p>
                </div>
              )}
            </div>

            {/* My Video */}
            <div className="absolute bottom-4 right-4 flex h-36 w-24 items-center justify-center overflow-hidden rounded-lg shadow-md md:bottom-14 md:right-10 md:h-36 md:w-[230px]">
              {videoAndAudio.video ? (
                <video
                  ref={myVideo}
                  className="h-full w-full rounded-lg object-cover"
                  playsInline
                  autoPlay
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-black">
                  <VideoOff size={25} color="gray" />
                  <p className="hidden text-xs font-semibold text-gray-400 md:flex">
                    Your camera is turned off
                  </p>
                </div>
              )}

              {isMuted && (
                <div className="absolute bottom-3 right-3 z-50">
                  <MicOff size={25} color="white" />
                </div>
              )}
            </div>

            {!callAccepted && <audio src={AudioRing} autoPlay loop />}
          </div>
        )}
      </div>
    </div>
  );
}

export default Call;
