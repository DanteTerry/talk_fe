import CallAction from "./CallAction";
import VoiceCallContainer from "./VoiceCallContainer";
import AudioRing from "../../../public/ringing.mp3";
import { MicOff, VideoOff } from "lucide-react";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { CallData } from "../../types/types";

function Call({
  call,
  callAccepted,
  userVideo,
  myVideo,
  callType,
  endCall,
  videoAndAudio,
  toggleVideo,
  toggleAudio,
  remoteUserVideo,
  remoteUserAudio,
  audioCallTo,
  stream,
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
    SetStateAction<{
      video: boolean;
      audio: boolean;
    }>
  >;
  videoAndAudio: { video: boolean; audio: boolean };
  toggleVideo: () => void;
  toggleAudio: () => void;
  remoteUserAudio: boolean;
  remoteUserVideo: boolean;
  audioCallTo: { name: string; picture: string };
}) {
  const { callEnded } = call;
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div
      className={`absolute left-1/2 top-1/2 z-50 col-span-9 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-slate-800`}
    >
      <div className="relative flex h-full w-full flex-col justify-between">
        {/* container */}
        {callType === "voice" && (
          <VoiceCallContainer
            audioCallTo={audioCallTo}
            call={call}
            callAccepted={callAccepted}
            stream={stream}
            remoteUserAudio={remoteUserAudio}
            isMuted={isMuted}
            myVideo={myVideo}
            userVideo={userVideo}
          />
        )}

        {/* actions */}
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

        {/* video streams */}

        {callType === "video" && (
          <div className="absolute flex h-[90vh] w-full items-center justify-center bg-slate-800">
            {/* user video */}
            <div
              className={`relative h-[91%] w-[98%] overflow-hidden rounded-xl bg-black`}
            >
              {callAccepted && !callEnded && remoteUserVideo && (
                <video
                  ref={userVideo}
                  className="w-full"
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
                <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-2 bg-black">
                  <VideoOff size={25} color="gray" />
                  <p className="text-xs font-semibold text-gray-500">
                    User camera is turned off
                  </p>
                </div>
              )}

              {/* remote user video */}

              {/* my video */}
            </div>
            <div className="absolute bottom-14 right-10 flex h-36 w-[230px] items-center justify-center overflow-hidden rounded-xl text-white shadow-md">
              {videoAndAudio.video && (
                <video
                  ref={myVideo}
                  className="z-50 w-full"
                  playsInline
                  autoPlay
                />
              )}

              {!videoAndAudio.video && (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-black">
                  <VideoOff size={25} color="gray" />
                  <p className="text-xs font-semibold text-gray-500">
                    Your camera is turned off
                  </p>
                </div>
              )}

              {isMuted && (
                <div className="absolute bottom-3 right-3 z-50">
                  <MicOff size={25} />
                </div>
              )}
            </div>
            {!callAccepted && !callEnded && (
              <audio src={AudioRing} autoPlay loop></audio>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Call;
