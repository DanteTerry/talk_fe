import { Video, X } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdCallEnd } from "react-icons/md";

import { useEffect, useState } from "react";
import AudioRing from "../../../public/ringing.mp3";

function Ringing({
  call,
  setCall,
  callType,
  answerCall,
  endCall,
}: {
  call: any;
  setCall: any;
  callType: "video" | "audio" | "";
  answerCall: () => void;
  endCall: () => void;
}) {
  const [timer, setTimer] = useState(0);

  let interval: any;

  const handleTimer = () => {
    interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    if (timer <= 30) {
      handleTimer();
    } else {
      setCall({ ...call, receivingCall: false });
    }

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="absolute left-1/2 top-1/2 z-50 col-span-9 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[#202c33]/85">
      <div className="flex h-full items-center justify-center rounded-lg">
        <div className="rounded-xl bg-[#202c33]">
          <div className="flex items-center justify-between rounded-t-xl bg-green-500 text-white">
            <p className="px-4">Video call - Talk</p>
            <button className="rounded-tr-xl bg-red-600 px-4 py-2">
              <X size={24} strokeWidth={1.8} className="course-pointer" />
            </button>
          </div>

          <div className="flex flex-col justify-between gap-6 px-4 py-3">
            <div className="flex w-full flex-col items-center justify-center gap-2 pt-6">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-green-400">
                <img src={call.picture} className="h-full w-full" />
              </div>
              <div className="flex flex-col items-center text-white">
                <p className="text-lg">{call.name}</p>
                <p className="text-sm">{callType} call</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-b-xl pb-2 text-white">
              <button className="rounded-full bg-gray-700 px-4 py-2">
                <BsThreeDots size={25} />
              </button>
              <button
                className="flex items-center gap-3 rounded-full bg-green-500 px-4 py-2"
                onClick={answerCall}
              >
                <Video strokeWidth={1.4} />
                <span className="text-sm">Accept</span>
              </button>
              <button
                className="rounded-full bg-red-700 px-4 py-2"
                onClick={endCall}
              >
                <MdCallEnd size={25} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <audio src={AudioRing} autoPlay loop></audio>
    </div>
  );
}

export default Ringing;
