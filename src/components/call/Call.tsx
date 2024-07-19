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
}: {
  call: CallData;
  setCall: Dispatch<SetStateAction<CallData>>;
  callAccepted: boolean;
  userVideo: any;
  myVideo: any;
  stream: any;
}) {
  const { receivingCall, callEnded } = call;
  const isVideoCall = true;

  return (
    <div className="absolute left-1/2 top-1/2 col-span-9 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[#202c33]">
      <div className="relative flex h-full w-full flex-col justify-between">
        {/* container */}
        <VoiceCallContainer name={"arpit Yadav"} />

        {/* actions */}
        <CallAction />

        {/* video streams */}

        {isVideoCall && (
          <div className="absolute flex h-[91vh] w-full items-center justify-center bg-slate-800">
            {/* user video */}
            <div className="relative h-[91%] w-[98%] overflow-hidden rounded-xl bg-green-500">
              <video
                ref={userVideo}
                className="w-full"
                playsInline
                muted
                autoPlay
              ></video>
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

      {receivingCall && !callEnded && <Ringing call={call} setCall={setCall} />}
    </div>
  );
}

export default Call;
