import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { debounce } from "lodash";

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
    config.speechRecognitionLanguage = "en-US";
    config.addTargetLanguage(targetLanguage);
    return config;
  }, [targetLanguage]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetTranslatedText = useCallback(
    debounce((text: string) => {
      setTranslatedText(text);
    }, 300),
    [],
  );

  const startListening = useCallback(() => {
    if (!audioStream) {
      console.error("No audio stream provided");
      return;
    }

    const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(audioStream);
    const newRecognizer = new SpeechSDK.TranslationRecognizer(
      speechTranslationConfig,
      audioConfig,
    );

    newRecognizer.startContinuousRecognitionAsync();

    newRecognizer.recognizing = (_, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
        debouncedSetTranslatedText(
          e.result.translations.get(targetLanguage) || "",
        );
      }
    };

    newRecognizer.recognized = (_, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
        debouncedSetTranslatedText(
          e.result.translations.get(targetLanguage) || "",
        );
      } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
        console.error("No speech could be recognized.");
      } else if (e.result.reason === SpeechSDK.ResultReason.Canceled) {
        console.error("Speech recognition canceled: ", e.result.errorDetails);
      }
    };

    recognizerRef.current = newRecognizer;
  }, [
    audioStream,
    speechTranslationConfig,
    targetLanguage,
    debouncedSetTranslatedText,
  ]);

  const stopListening = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(
        () => {
          recognizerRef.current?.close();
          recognizerRef.current = null;
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
    <div className="container mx-auto p-4">
      <div className="mt-4 flex gap-2 rounded p-4">
        <h2 className="text-xl font-bold">Translated Call :</h2>
        <p>{translatedText}</p>
      </div>
    </div>
  );
};

export default RealTimeTranslation;
