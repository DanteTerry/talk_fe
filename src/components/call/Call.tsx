import { CallData } from "../../types/types";
import CallAction from "./CallAction";
import Ringing from "./Ringing";
import { Dispatch, SetStateAction } from "react";
import VoiceCallContainer from "./VoiceCallContainer";

function Call({
  call,
  setCall,
  callAccepted,
}: {
  call: CallData;
  setCall: Dispatch<SetStateAction<CallData>>;
  callAccepted: boolean;
}) {
  const { receivingCall, callEnded } = call;

  return (
    <div className="absolute left-1/2 top-1/2 col-span-9 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[#202c33]">
      <div className="relative flex h-full w-full flex-col justify-between">
        {/* header */}

        {/* container */}
        <VoiceCallContainer />

        {/* actions */}
        <CallAction />
      </div>

      {receivingCall && !callEnded && <Ringing call={call} setCall={setCall} />}
    </div>
  );
}

export default Call;
