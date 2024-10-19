import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

// Map simple language codes to full locale codes
const languageLocaleMap: { [key: string]: string } = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  cs: "cs-CZ",
  hi: "hi-IN",
  ja: "ja-JP",
  ko: "ko-KR",
  ru: "ru-RU",
  zh: "zh-CN",
  fil: "fil-PH",
};

interface RealTimeTranslationProps {
  audioStream: MediaStream | undefined;
  targetLanguage: string;
  inputLanguage: string;
  isTranslating: boolean;
  voice: string;
  isLoudTranslating: boolean;
}

const RealTimeTranslation = ({
  audioStream,
  targetLanguage,
  inputLanguage,
  isLoudTranslating,
  voice,
  isTranslating,
}: RealTimeTranslationProps) => {
  const [translatedText, setTranslatedText] = useState("");
  const recognizerRef = useRef<SpeechSDK.TranslationRecognizer | null>(null);
  const synthesizerRef = useRef<SpeechSDK.SpeechSynthesizer | null>(null);

  // Map inputLanguage to its locale format or default to "en-US"
  const speechRecognitionLanguage = useMemo(() => {
    return languageLocaleMap[inputLanguage] || "en-US";
  }, [inputLanguage]);

  const speechTranslationConfig = useMemo(() => {
    const config = SpeechSDK.SpeechTranslationConfig.fromSubscription(
      import.meta.env.VITE_APP_AZURE_SPEECH_KEY as string,
      import.meta.env.VITE_APP_AZURE_SPEECH_REGION as string,
    );
    config.speechRecognitionLanguage = speechRecognitionLanguage;
    config.addTargetLanguage(targetLanguage || "cs");
    return config;
  }, [targetLanguage, speechRecognitionLanguage]);

  const startListening = useCallback(() => {
    if (!audioStream) {
      console.error("No audio stream provided");
      return;
    }

    const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(audioStream);
    const translationRecognizer = new SpeechSDK.TranslationRecognizer(
      speechTranslationConfig,
      audioConfig,
    );

    translationRecognizer.startContinuousRecognitionAsync(
      () => {
        console.log("Recognition started successfully.");
      },
      (err) => {
        console.error("Failed to start recognition: ", err);
      },
    );

    translationRecognizer.recognizing = (_, event) => {
      if (event.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
        const translation = event.result.translations.get(targetLanguage);
        setTranslatedText(translation || ""); // Update translated text
        console.log("Recognizing:", translation); // Debug log
      }
    };

    translationRecognizer.recognized = (_, event) => {
      if (event.result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
        const translation = event.result.translations.get(targetLanguage);
        setTranslatedText(translation || ""); // Update translated text
        console.log("Recognized:", translation); // Debug log

        // Only execute speech synthesis if isLoudTranslating is true
        if (isLoudTranslating && translation) {
          // Check if the synthesizer is already created, reuse if it exists
          if (!synthesizerRef.current) {
            const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
              import.meta.env.VITE_APP_AZURE_SPEECH_KEY as string,
              import.meta.env.VITE_APP_AZURE_SPEECH_REGION as string,
            );
            speechConfig.speechSynthesisLanguage = targetLanguage; // Set synthesis language to target language
            speechConfig.speechSynthesisVoiceName =
              voice || "en-US-JennyNeural"; // Ensure the selected voice is used

            synthesizerRef.current = new SpeechSDK.SpeechSynthesizer(
              speechConfig,
            );
          }

          // Construct SSML with selected voice and default prosody
          const ssml = `
            <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="${targetLanguage}">
              <voice name="${voice}">
                <mstts:express-as style="cheerful">
                  <prosody rate="0%" pitch="0%">
                    ${translation}
                  </prosody>
                </mstts:express-as>
              </voice>
            </speak>`;

          // Speak the SSML
          synthesizerRef.current.speakSsmlAsync(
            ssml,
            (result) => {
              if (
                result.reason ===
                SpeechSDK.ResultReason.SynthesizingAudioCompleted
              ) {
                console.log("Synthesis completed.");
              } else {
                console.error("Synthesis failed: ", result.errorDetails);
              }
            },
            (err) => {
              console.error("Speech synthesis error: ", err);
            },
          );
        }
      } else if (event.result.reason === SpeechSDK.ResultReason.NoMatch) {
        console.warn("No speech could be recognized.");
      } else if (event.result.reason === SpeechSDK.ResultReason.Canceled) {
        const cancellationDetails = SpeechSDK.CancellationDetails.fromResult(
          event.result,
        );
        console.error(
          "Speech recognition canceled: ",
          cancellationDetails.errorDetails,
        );
      }
    };

    recognizerRef.current = translationRecognizer;
  }, [
    audioStream,
    speechTranslationConfig,
    targetLanguage,
    voice,
    isLoudTranslating,
  ]);

  const stopListening = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(
        () => {
          console.log("Recognition stopped successfully.");
          recognizerRef.current?.close();
          recognizerRef.current = null;
        },
        (err) => {
          console.error("Error stopping recognition: ", err);
          recognizerRef.current?.close();
          recognizerRef.current = null;
        },
      );

      // Close the synthesizer when recognition stops
      if (synthesizerRef.current) {
        synthesizerRef.current.close();
        synthesizerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (isTranslating && audioStream) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      stopListening();
    };
  }, [audioStream, isTranslating, startListening, stopListening]);

  return (
    <div className="absolute bottom-0 left-0 w-3/4 p-4 text-center text-white sm:w-full">
      <p className="text-lg">{translatedText}</p>
    </div>
  );
};

export default RealTimeTranslation;
