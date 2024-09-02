import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { MdCallEnd } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

function CallAction({
  callType,
  endCall,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // setVideoAndAudio,
  videoAndAudio,
  toggleVideo,
  toggleAudio,
  setIsMuted,
}: {
  callType: "video" | "voice" | null;
  endCall: () => void;
  // setVideoAndAudio: Dispatch<
  //   SetStateAction<{
  //     video: boolean;
  //     audio: boolean;
  //   }>
  // >;
  videoAndAudio: { video: boolean; audio: boolean };
  toggleVideo: () => void;
  toggleAudio: () => void;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
}) {
  const { activeConversation } = useSelector((state: RootState) => state.chat);

  return (
    <div
      className={`fixed z-50 flex w-full justify-center ${activeConversation?._id ? "bottom-0" : "bottom-0"}`}
    >
      <div
        className={`flex w-full justify-center gap-3 rounded-t-3xl px-3 py-4 ${callType === "video" ? "bg-gray-900" : "bg-transparent"} text-white`}
      >
        {/* add user button */}

        {/* video button */}

        {callType === "video" && (
          <button
            className="grid h-12 w-12 place-items-center rounded-full bg-slate-800 p-1"
            onClick={toggleVideo}
          >
            {videoAndAudio.video ? <Video size={25} /> : <VideoOff size={25} />}
          </button>
        )}

        {/* microphone button */}

        <button
          className="grid h-12 w-12 place-items-center rounded-full bg-slate-800 p-1"
          onClick={() => {
            toggleAudio();
            setIsMuted((prev) => !prev);
          }}
        >
          {videoAndAudio.audio ? <Mic size={25} /> : <MicOff size={25} />}
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
