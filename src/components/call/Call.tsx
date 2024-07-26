import { CallData } from "../../types/types";
import CallAction from "./CallAction";

import { Dispatch, SetStateAction } from "react";
import VoiceCallContainer from "./VoiceCallContainer";
import AudioRing from "../../../public/ringing.mp3";
import { Video, VideoOff } from "lucide-react";

function Call({
  call,
  callAccepted,
  userVideo,
  myVideo,
  callType,
  endCall,
  setVideoAndAudio,
  videoAndAudio,
  toggleVideo,
  toggleAudio,
  remoteUserVideo,
}: {
  call: CallData;
  setCall: Dispatch<SetStateAction<CallData>>;
  callAccepted: boolean;
  userVideo: any;
  myVideo: any;
  stream: any;
  callType: "video" | "audio" | null;
  answerCall: () => void;
  endCall: () => void;
  setVideoAndAudio: any;
  videoAndAudio: { video: boolean; audio: boolean };
  toggleVideo: () => void;
  toggleAudio: () => void;
  remoteUserVideo: boolean;
}) {
  const { callEnded } = call;

  return (
    <div
      className={`absolute left-1/2 top-1/2 col-span-9 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-slate-800`}
    >
      <div className="relative flex h-full w-full flex-col justify-between">
        {/* container */}
        {callType === "audio" && <VoiceCallContainer name={"arpit Yadav"} />}

        {/* actions */}
        {(callType === "video" || callType === "audio") && (
          <CallAction
            callType={callType}
            endCall={endCall}
            setVideoAndAudio={setVideoAndAudio}
            videoAndAudio={videoAndAudio}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
          />
        )}

        {/* video streams */}

        {callType === "video" && (
          <div className="absolute flex h-[90vh] w-full items-center justify-center bg-slate-800">
            {/* user video */}
            <div
              className={`relative h-[91%] w-[98%] overflow-hidden rounded-xl bg-black`}
            >
              {callAccepted && !callEnded && (
                <video
                  ref={userVideo}
                  className="z-50 w-full"
                  playsInline
                  autoPlay
                />
              )}

              {!remoteUserVideo && (
                <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-2 bg-black">
                  <VideoOff size={25} color="gray" />
                  <p className="text-xs font-semibold text-gray-500">
                    User camera is turned off
                  </p>
                </div>
              )}

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
            </div>
            {!callAccepted && <audio src={AudioRing} autoPlay loop></audio>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Call;
