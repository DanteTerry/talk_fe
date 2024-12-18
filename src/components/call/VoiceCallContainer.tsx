import { useEffect, useRef, useState } from "react";
import { continuousVisualizer } from "sound-visualizer";
import { CallData } from "../../types/types";

interface VoiceCallContainerProps {
  audioCallTo: { name: string; picture: string };
  call: CallData;
  callAccepted: boolean;
  stream: MediaStream | undefined;
  isMuted: boolean;
  remoteUserAudio: boolean;
  userVideo: React.RefObject<HTMLAudioElement>;
  myVideo: React.RefObject<HTMLAudioElement>;
  isLoudTranslating: boolean;
}

function VoiceCallContainer({
  audioCallTo,
  call,
  callAccepted,
  stream,
  isMuted,
  remoteUserAudio,
  isLoudTranslating,
  userVideo,
  myVideo,
}: VoiceCallContainerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const myAudioRef = useRef<HTMLAudioElement | null>(null);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);

  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start the timer when the call is accepted, stop/reset when call ends
  useEffect(() => {
    if (callAccepted) {
      // Start the timer
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      // Stop and reset the timer when the call is not accepted
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimer(0);
    }

    // Cleanup on component unmount or call end
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callAccepted]);

  // Format the time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // Visualizer effect
  useEffect(() => {
    let startVisualizer: (() => void) | undefined;
    let stopVisualizer: (() => void) | undefined;

    if (canvasRef.current && stream instanceof MediaStream && callAccepted) {
      const canvas = canvasRef.current;
      const options = {
        strokeColor: "#22c55e",
        lineWidth: "thick",
        slices: 100,
      };

      const audioTracks = stream.getAudioTracks();

      if (audioTracks.length > 0 && (!isMuted || !remoteUserAudio)) {
        ({ start: startVisualizer, stop: stopVisualizer } =
          continuousVisualizer(stream, canvas, options));
        startVisualizer();
      }
    }

    return () => {
      if (stopVisualizer) stopVisualizer();
    };
  }, [stream, callAccepted, isMuted, remoteUserAudio]);

  // Attach the MediaStream to the audio elements for playback
  useEffect(() => {
    if (myAudioRef.current && stream instanceof MediaStream) {
      myAudioRef.current.srcObject = stream;
    }
    if (userAudioRef.current && stream instanceof MediaStream) {
      userAudioRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="callBackground flex h-screen w-full items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="flex w-full max-w-lg flex-col items-center justify-center gap-6 rounded-lg shadow-2xl">
        <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-green-500 shadow-md">
          <img
            src={call.picture || audioCallTo.picture}
            className="h-full w-full object-cover"
            alt="Call"
          />
        </div>
        <div className="flex flex-col items-center text-white">
          <p className="text-2xl font-bold capitalize leading-tight">
            {call.name || audioCallTo.name}
          </p>
          {!callAccepted && (
            <p className="text-lg leading-tight text-white">Ringing...</p>
          )}
          {callAccepted && (
            <>
              <canvas ref={canvasRef} className="mt-4 h-20 w-40"></canvas>
              <p className="mt-2 text-lg leading-tight">{formatTime(timer)}</p>
            </>
          )}
          <audio ref={myVideo} autoPlay muted={isMuted} className="hidden" />
          <audio
            ref={userVideo}
            autoPlay
            muted={!remoteUserAudio || isLoudTranslating}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

export default VoiceCallContainer;
