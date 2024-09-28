import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { MdCallEnd } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

function CallAction({
  callType,
  endCall,
  videoAndAudio,
  toggleVideo,
  toggleAudio,
  setIsMuted,
}: {
  callType: "video" | "voice" | null;
  endCall: () => void;
  videoAndAudio: { video: boolean; audio: boolean };
  toggleVideo: () => void;
  toggleAudio: () => void;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
}) {
  const { activeConversation } = useSelector((state: RootState) => state.chat);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 flex w-full justify-center ${
        activeConversation?._id ? "bottom-0" : "bottom-0"
      }`}
    >
      <div
        className={`flex w-full max-w-md justify-center gap-4 rounded-t-2xl px-4 py-3 ${
          callType === "video" ? "bg-gray-900" : "bg-transparent"
        } text-white shadow-lg`}
      >
        {/* Video button */}
        {callType === "video" && (
          <button
            className="grid h-14 w-14 place-items-center rounded-full bg-slate-700 transition duration-300 ease-in-out hover:bg-slate-600"
            onClick={toggleVideo}
            aria-label="Toggle Video"
          >
            {videoAndAudio.video ? <Video size={28} /> : <VideoOff size={28} />}
          </button>
        )}

        {/* Microphone button */}
        <button
          className="grid h-14 w-14 place-items-center rounded-full bg-slate-700 transition duration-300 ease-in-out hover:bg-slate-600"
          onClick={() => {
            toggleAudio();
            setIsMuted((prev) => !prev);
          }}
          aria-label="Toggle Audio"
        >
          {videoAndAudio.audio ? <Mic size={28} /> : <MicOff size={28} />}
        </button>

        {/* End call button */}
        <button
          className="grid h-14 w-14 place-items-center rounded-full bg-red-600 transition duration-300 ease-in-out hover:bg-red-500"
          onClick={endCall}
          aria-label="End Call"
        >
          <MdCallEnd size={28} />
        </button>
      </div>
    </div>
  );
}

export default CallAction;
