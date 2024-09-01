import { RefObject, useEffect, useRef } from "react";
import { continuousVisualizer } from "sound-visualizer";
import { createTimeModel, useTimeModel } from "react-compound-timer";
import { CallData } from "../../types/types";

// Create a timer model instance
const timer = createTimeModel({
  initialTime: 0,
  timeToUpdate: 1000,
  direction: "forward",
});

interface VoiceCallContainerProps {
  audioCallTo: { name: string; picture: string };
  call: CallData;
  callAccepted: boolean;
  stream: MediaStream | undefined;
  isMuted: boolean;
  remoteUserAudio: boolean;
  userVideo: RefObject<HTMLAudioElement>; // Change to HTMLAudioElement
  myVideo: RefObject<HTMLAudioElement>; // Change to HTMLAudioElement
}

function VoiceCallContainer({
  audioCallTo,
  call,
  callAccepted,
  stream,
  isMuted,
  remoteUserAudio,
  userVideo,
  myVideo,
}: VoiceCallContainerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Type the canvas ref
  const myAudioRef = useRef<HTMLAudioElement | null>(null); // Type the audio ref
  const userAudioRef = useRef<HTMLAudioElement | null>(null); // Type the audio ref

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

  console.log(callAccepted);

  const useTimer = useTimeModel(timer);

  useEffect(() => {
    if (callAccepted) {
      useTimer.start();
    } else {
      useTimer.stop();
      useTimer.reset();
    }

    return () => {
      useTimer.stop();
      useTimer.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callAccepted]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTime = (time: any) => {
    const minutes = time?.m ?? 0;
    const seconds = time?.s ?? 0;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

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
    <div className="callBackground flex h-[100vh] w-full items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="h-48 w-48 overflow-hidden rounded-full">
          <img
            src={call.picture || audioCallTo.picture}
            className="h-full w-full"
            alt="Call"
          />
        </div>
        <div className="flex flex-col items-center text-white">
          <p className="text-3xl capitalize leading-tight">
            {call.name || audioCallTo.name}
          </p>
          {!callAccepted && <p className="text-xl leading-tight">Ringing</p>}
          {callAccepted && (
            <canvas
              ref={canvasRef}
              className="h-16 w-32 leading-tight"
            ></canvas>
          )}

          {callAccepted && (
            <p className="text-xl leading-tight">
              {formatTime(useTimer?.value)}
            </p>
          )}

          <audio ref={myVideo} autoPlay muted={isMuted} />
          <audio ref={userVideo} autoPlay muted={!remoteUserAudio} />
        </div>
      </div>
    </div>
  );
}

export default VoiceCallContainer;
