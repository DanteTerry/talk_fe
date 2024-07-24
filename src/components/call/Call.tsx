import { CallData } from "../../types/types";
import CallAction from "./CallAction";

import { Dispatch, SetStateAction, useState } from "react";
import VoiceCallContainer from "./VoiceCallContainer";
import AudioRing from "../../../public/ringing.mp3";

function Call({
  call,

  callAccepted,
  userVideo,
  myVideo,
  callType,

  endCall,
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
}) {
  const { callEnded } = call;
  const [toggle, setToggle] = useState(false);
  return (
    <div
      className={`absolute left-1/2 top-1/2 col-span-9 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-slate-800`}
    >
      <div className="relative flex h-full w-full flex-col justify-between">
        {/* container */}
        {callType === "audio" && <VoiceCallContainer name={"arpit Yadav"} />}

        {/* actions */}
        {(callType === "video" || callType === "audio") && (
          <CallAction callType={callType} endCall={endCall} />
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
                  muted
                  autoPlay
                />
              )}
              {/* my video */}
            </div>
            <div className="absolute bottom-14 right-10 flex h-36 w-[230px] items-center justify-center overflow-hidden rounded-xl bg-green-500 text-white shadow-md">
              <video
                ref={myVideo}
                className="z-50 w-full"
                playsInline
                muted
                autoPlay
              />
            </div>
            {!callAccepted && <audio src={AudioRing} autoPlay loop></audio>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Call;