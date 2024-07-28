import { useEffect, useRef, useState } from "react";
import { continuousVisualizer } from "sound-visualizer";

function VoiceCallContainer({
  audioCallTo,
  call,
  callAccepted,
  stream,
}: {
  callAccepted: boolean;
  audioCallTo: { name: string; picture: string };
  call: any;
  stream: any;
}) {
  const canvasRef = useRef(null);

  const [callRunning, setCallRunning] = useState<Date>();

  useEffect(() => {
    if (canvasRef.current && stream instanceof MediaStream) {
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

    if (callAccepted) {
      const interval = setInterval(() => {
        setCallRunning(new Date());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [stream, callAccepted]);

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

          {callAccepted && <p className="text-xl">2:30 </p>}
        </div>
      </div>
    </div>
  );
}

export default VoiceCallContainer;
