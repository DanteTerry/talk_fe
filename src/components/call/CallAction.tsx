import { Mic, UserPlus, Video } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdCallEnd } from "react-icons/md";
import { useSelector } from "react-redux";

function CallAction({
  callType,
  endCall,
}: {
  callType: "video" | "audio" | null;
  endCall: () => void;
}) {
  const { activeConversation } = useSelector((state) => state.chat);

  return (
    <div
      className={`absolute z-50 flex w-full justify-center ${activeConversation._id ? "bottom-16" : "bottom-0"}`}
    >
      <div className="flex w-full justify-center gap-3 rounded-t-3xl bg-gray-900 px-3 py-4 text-white">
        {/* add user button */}
        <button className="grid h-12 w-12 place-items-center rounded-full bg-slate-800 p-1">
          <UserPlus size={25} />
        </button>

        {/* video button */}
        <button className="grid h-12 w-12 place-items-center rounded-full bg-slate-800 p-1">
          <Video size={25} />
        </button>

        {/* microphone button */}
        <button className="grid h-12 w-12 place-items-center rounded-full bg-slate-800 p-1">
          <Mic size={25} />
        </button>

        {/* extra button */}
        <button className="grid h-12 w-12 place-items-center rounded-full bg-slate-800 p-1">
          <BsThreeDots size={25} />
        </button>

        {/* end call button */}
        <button
          className="grid place-items-center rounded-full bg-red-700 px-7 py-1"
          onClick={endCall}
        >
          <MdCallEnd size={25} />
        </button>
      </div>
    </div>
  );
}

export default CallAction;
