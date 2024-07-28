import { useEffect, useRef } from "react";
import { continuousVisualizer } from "sound-visualizer";
import { createTimeModel, useTimeModel } from "react-compound-timer";

const timer = createTimeModel({
  initialTime: 0,
  timeToUpdate: 1000,
  direction: "forward",
});

function VoiceCallContainer({ audioCallTo, call, callAccepted, stream }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && stream instanceof MediaStream && callAccepted) {
      const canvas = canvasRef.current;
      const options = {
        strokeColor: "#22c55e",
        lineWidth: "thick",
        slices: 100,
      };
      const { start, stop } = continuousVisualizer(stream, canvas, options);

      start();

      return () => stop();
    }
  }, [stream, callAccepted]);

  // Start the timer only when callAccepted is true
  useEffect(() => {
    if (callAccepted) {
      timer.start();
    } else {
      timer.stop();
    }

    return () => {
      timer.stop(); // Stop the timer when the component unmounts
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
          <p className="text-3xl capitalize">{call.name || audioCallTo.name}</p>
          {!callAccepted && <p className="text-xl">Ringing</p>}
          {callAccepted && (
            <canvas ref={canvasRef} className="h-max w-32"></canvas>
          )}

          {callAccepted && (
            <p className="text-xl">{formatTime(useTimer?.value)}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoiceCallContainer;
