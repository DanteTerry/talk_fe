import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdCallEnd } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import RealTimeTranslation from "../RealTimeTranslation";
import { PiTranslateBold } from "react-icons/pi";
import { options } from "../../constants/constants";

const languageToVoiceMap: Record<string, { male: string; female: string }> = {
  cs: { male: "cs-CZ-AntoninNeural", female: "cs-CZ-VlastaNeural" }, // Czech
  en: { male: "en-US-GuyNeural", female: "en-US-JennyNeural" }, // English (US)
  fr: { male: "fr-FR-HenriNeural", female: "fr-FR-DeniseNeural" }, // French
  de: { male: "de-DE-ConradNeural", female: "de-DE-KatjaNeural" }, // German
  hi: { male: "hi-IN-MadhurNeural", female: "hi-IN-SwaraNeural" }, // Hindi
  ja: { male: "ja-JP-KeitaNeural", female: "ja-JP-NanamiNeural" }, // Japanese
  ko: { male: "ko-KR-InJoonNeural", female: "ko-KR-SunHiNeural" }, // Korean
  ph: { male: "fil-PH-AngeloNeural", female: "fil-PH-BlessicaNeural" }, // Filipino
  ru: { male: "ru-RU-DmitryNeural", female: "ru-RU-DariyaNeural" }, // Russian
  es: { male: "es-ES-AlvaroNeural", female: "es-ES-ElviraNeural" }, // Spanish (Spain)
  "zh-Hans": { male: "zh-CN-YunxiNeural", female: "zh-CN-XiaoxiaoNeural" }, // Chinese (Simplified)
};

function CallAction({
  callType,
  endCall,
  videoAndAudio,
  toggleVideo,
  toggleAudio,
  setIsMuted,
  isLoudTranslating,
  setIsLoudTranslating,
  remoteAudioStream,
}: {
  callType: "video" | "voice" | null;
  endCall: () => void;
  videoAndAudio: { video: boolean; audio: boolean };
  toggleVideo: () => void;
  toggleAudio: () => void;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
  remoteAudioStream: MediaStream | undefined;
  isLoudTranslating: boolean;
  setIsLoudTranslating: Dispatch<SetStateAction<boolean>>;
}) {
  const { activeConversation } = useSelector((state: RootState) => state.chat);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslatorDiv, setShowTranslatorDiv] = useState(false);
  const [otherUserLanguage, setOtherUserLanguage] = useState("en");
  const { language } = useSelector((state: RootState) => state.translate);
  const [userLanguage, setUserLanguage] = useState(language);
  const [voice, setVoice] = useState("");

  // Get voice options based on user language
  const voiceOptions = languageToVoiceMap[userLanguage];

  // Set the initial voice state based on userLanguage when it changes
  useEffect(() => {
    if (voiceOptions) {
      setVoice(voiceOptions.male);
    }
  }, [userLanguage, voiceOptions]);

  console.log(voice);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 flex w-full justify-center bg-[#111827] ${
        activeConversation?._id ? "bottom-0" : "bottom-0"
      }`}
    >
      <div
        className={`relative flex w-full max-w-md justify-center gap-4 rounded-t-2xl px-4 py-3 ${
          callType === "video" ? "bg-gray-900" : "bg-transparent"
        } text-white shadow-lg md:max-w-lg lg:max-w-xl`}
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
          className={`grid h-14 w-14 place-items-center rounded-full bg-slate-700 transition duration-300 ease-in-out hover:bg-slate-600`}
          onClick={() => {
            toggleAudio();
            setIsMuted((prev) => !prev);
          }}
          aria-label="Toggle Audio"
        >
          {videoAndAudio.audio ? <Mic size={28} /> : <MicOff size={28} />}
        </button>

        {/* Translate button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowTranslatorDiv((prev) => !prev);
          }}
          className="grid h-14 w-14 place-items-center rounded-full bg-slate-700 transition duration-300 ease-in-out hover:bg-slate-600"
          aria-label="Translate Call"
        >
          <PiTranslateBold size={28} />
        </button>

        {showTranslatorDiv && (
          <div className="absolute bottom-20 left-1/2 z-50 w-[200px] -translate-x-1/2 transform rounded-lg bg-gray-800 p-4 shadow-lg">
            <div className="mb-4">
              <label className="mb-2 block text-sm" htmlFor="user-language">
                Your Language
              </label>
              <select
                disabled={isLoudTranslating || isTranslating}
                id="user-language"
                value={userLanguage}
                onChange={(e) => setUserLanguage(e.target.value)}
                className="w-full rounded bg-gray-700 p-2 text-white"
              >
                {options.map((option) => (
                  <option
                    key={option.code}
                    value={option.code}
                    className={`flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-1 text-sm capitalize text-black hover:bg-gray-200 dark:text-white dark:hover:bg-slate-600 ${option.code === userLanguage ? "bg-gray-200 dark:bg-slate-600" : ""}`}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="mb-2 block text-sm"
                htmlFor="other-user-language"
              >
                Other User's Language
              </label>
              <select
                disabled={isLoudTranslating || isTranslating}
                id="other-user-language"
                value={otherUserLanguage}
                onChange={(e) => setOtherUserLanguage(e.target.value)}
                className="w-full rounded bg-gray-700 p-2 text-white"
              >
                {options.map((option) => (
                  <option
                    key={option.code}
                    value={option.code}
                    className={`flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-1 text-sm capitalize text-black hover:bg-gray-200 dark:text-white dark:hover:bg-slate-600 ${option.code === otherUserLanguage ? "bg-gray-200 dark:bg-slate-600" : ""}`}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {voiceOptions && (
              <div className="mt-4">
                <label className="mb-2 block text-sm">Select Voice</label>
                <select
                  disabled={isLoudTranslating || isTranslating}
                  value={voice}
                  onChange={(e) =>
                    setVoice(e.target.value as "male" | "female")
                  }
                  className="w-full rounded bg-gray-700 p-2 text-white"
                >
                  <option value={voiceOptions.male}>Male</option>
                  <option value={voiceOptions.female}>Female</option>
                </select>
              </div>
            )}

            <button
              onClick={() => {
                setIsLoudTranslating((prev) => !prev);
                setIsTranslating((prev) => !prev);
              }}
              className="mt-4 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-500"
            >
              {isTranslating ? "Stop Translation" : "Start Translation"}
            </button>
          </div>
        )}

        {/* End call button */}
        <button
          className="grid h-14 w-14 place-items-center rounded-full bg-red-600 transition duration-300 ease-in-out hover:bg-red-500"
          onClick={endCall}
          aria-label="End Call"
        >
          <MdCallEnd size={28} />
        </button>

        <div className="absolute -top-10 w-full text-white">
          <RealTimeTranslation
            targetLanguage={userLanguage}
            isTranslating={isTranslating}
            inputLanguage={otherUserLanguage}
            audioStream={remoteAudioStream}
            voice={voice}
            isLoudTranslating={isLoudTranslating}
          />
        </div>
      </div>
    </div>
  );
}

export default CallAction;
