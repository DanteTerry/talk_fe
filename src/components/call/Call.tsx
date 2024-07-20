import { CallData } from "../../types/types";
import CallAction from "./CallAction";
import Ringing from "./Ringing";
import { Dispatch, SetStateAction } from "react";
import VoiceCallContainer from "./VoiceCallContainer";

function Call({
  call,
  setCall,
  callAccepted,
  userVideo,
  myVideo,
  stream,
  callType,
}: {
  call: CallData;
  setCall: Dispatch<SetStateAction<CallData>>;
  callAccepted: boolean;
  userVideo: any;
  myVideo: any;
  stream: any;
  callType: "video" | "audio" | null;
}) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 col-span-9 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-slate-800`}
    >
      <div className="relative flex h-full w-full flex-col justify-between">
        {/* container */}
        {callType === "audio" && <VoiceCallContainer name={"arpit Yadav"} />}

        {/* actions */}
        {(callType === "video" || callType === "audio") && (
          <CallAction callType={callType} />
        )}

        {/* video streams */}

        {callType === "video" && (
          <div className="absolute flex h-[90vh] w-full items-center justify-center bg-slate-800">
            {/* user video */}
            <div className="relative h-[91%] w-[98%] overflow-hidden rounded-xl bg-green-500">
              <video
                ref={myVideo}
                className="w-full"
                playsInline
                muted
                autoPlay
              />
              {/* my video */}
              <div className="absolute bottom-6 right-10 flex h-36 w-[230px] items-center justify-center overflow-hidden rounded-xl bg-black text-white shadow-md">
                <video
                  ref={myVideo}
                  playsInline
                  muted
                  autoPlay
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Call;
