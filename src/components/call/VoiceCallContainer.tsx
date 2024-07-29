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
  myVideo,
  userVideo,
}: {
  audioCallTo: { name: string; picture: string };
  call: any;
  callAccepted: boolean;
  stream: any;
  isMuted: boolean;
  remoteUserAudio: boolean;
  myVideo: any;
  userVideo: any;
}) {
  const canvasRef = useRef(null);
  const myAudioRef = useRef(null);
  const userAudioRef = useRef(null);

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

      // Log stream information for debugging

      const audioTracks = stream.getAudioTracks();
      console.log("Audio tracks:", audioTracks);

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

  useEffect(() => {
    if (callAccepted) {
      timer.start();
    } else {
      timer.reset();
    }

    return () => {
      timer.reset();
    };
  }, [callAccepted]);

  const useTimer = useTimeModel(timer);

  const formatTime = (time) => {
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

          <audio ref={myVideo} autoPlay muted={isMuted} />
          <audio ref={userVideo} autoPlay muted={!remoteUserAudio} />
        </div>
      </div>
    </div>
  );
}

export default VoiceCallContainer;
