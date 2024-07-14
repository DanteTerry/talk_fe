import { CallData } from "../../types/types";
import Ringing from "./Ringing";
import { Dispatch, SetStateAction } from "react";

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
    <div>
      {receivingCall && !callEnded ? (
        <Ringing call={call} setCall={setCall} />
      ) : null}
    </div>
  );
}

export default Call;
