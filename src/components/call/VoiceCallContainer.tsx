import { useEffect, useRef } from "react";
import { continuousVisualizer } from "sound-visualizer";
import { createTimeModel, useTimeModel } from "react-compound-timer";

const timer = createTimeModel({
  initialTime: 0,
  timeToUpdate: 1000,
  direction: "forward",
});

function VoiceCallContainer({
  audioCallTo,
  call,
  callAccepted,
  stream,
  isMuted,
  remoteUserAudio,
}: {
  audioCallTo: { name: string; picture: string };
  call: any;
  callAccepted: boolean;
  stream: MediaStream | null;
  isMuted: boolean;
  remoteUserAudio: boolean;
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let startVisualizer;
    let stopVisualizer;

    if (canvasRef.current && stream instanceof MediaStream && callAccepted) {
      const canvas = canvasRef.current;
      const options = {
        strokeColor: "#22c55e",
        lineWidth: "thick",
        slices: 100,
      };

      // Check if the MediaStream has audio tracks
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

  // Start the timer only when callAccepted is true
  useEffect(() => {
    if (callAccepted) {
      timer.start();
    } else {
      timer.reset();
    }

    return () => {
      timer.reset(); // Stop the timer when the component unmounts
    };
  }, [callAccepted]);

  const useTimer = useTimeModel(timer);

  // Format the time to display as MM:SS
  const formatTime = (time) => {
    const minutes = time?.m ?? 0;
    const seconds = time?.s ?? 0;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="callBackground flex h-[92vh] w-full items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="h-48 w-48 overflow-hidden rounded-full bg-green-500">
          <img
            src={call.picture || audioCallTo.picture}
            className="h-full w-full"
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
        </div>
      </div>
    </div>
  );
}

export default VoiceCallContainer;
