import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const RealTimeTranslation = ({
  audioStream,
}: {
  audioStream: MediaStream | undefined;
}) => {
  const [translatedText, setTranslatedText] = useState("");
  const recognizerRef = useRef<SpeechSDK.TranslationRecognizer | null>(null);

  const targetLanguage = "cs"; // Target translation language

  const speechTranslationConfig = useMemo(() => {
    const config = SpeechSDK.SpeechTranslationConfig.fromSubscription(
      import.meta.env.VITE_APP_AZURE_SPEECH_KEY as string,
      import.meta.env.VITE_APP_AZURE_SPEECH_REGION as string,
    );
    config.speechRecognitionLanguage = "en-US"; // Source language
    config.addTargetLanguage(targetLanguage); // Translation target
    return config;
  }, [targetLanguage]);

  const startListening = useCallback(() => {
    if (!audioStream) {
      console.error("No audio stream provided");
      return;
    }

    // Create an AudioConfig from the remote audio stream
    const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(audioStream);

    // Initialize a new recognizer for real-time translation
    const newRecognizer = new SpeechSDK.TranslationRecognizer(
      speechTranslationConfig,
      audioConfig,
    );

    newRecognizer.startContinuousRecognitionAsync();

    newRecognizer.recognizing = (_, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
        setTranslatedText(e.result.translations.get(targetLanguage) || "");
      }
    };

    newRecognizer.recognized = (_, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
        setTranslatedText(e.result.translations.get(targetLanguage) || "");
      } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
        console.error("No speech could be recognized.");
      } else if (e.result.reason === SpeechSDK.ResultReason.Canceled) {
        console.error("Speech recognition canceled: ", e.result.errorDetails);
      }
    };

    recognizerRef.current = newRecognizer;
  }, [audioStream, speechTranslationConfig, targetLanguage]);

  const stopListening = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(
        () => {
          if (recognizerRef.current) {
            recognizerRef.current.close();
            recognizerRef.current = null;
          }
        },
        (err) => {
          console.error("Error stopping recognition: ", err);
          recognizerRef.current?.close();
          recognizerRef.current = null;
        },
      );
    }
  }, []);

  useEffect(() => {
    if (audioStream) {
      startListening();
    }

    return () => {
      stopListening();
    };
  }, [audioStream, startListening, stopListening]);

  return (
    <div className="absolute bottom-0 left-0 w-full p-4 text-center text-white">
      <p className="text-lg">{translatedText}</p>
    </div>
  );
};

export default RealTimeTranslation;
