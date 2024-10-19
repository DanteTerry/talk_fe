import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

interface RealTimeTranslationProps {
  audioStream: MediaStream | undefined;
  targetLanguage: string;
  inputLanguage: string;
  isTranslating: boolean;
}

const languageToVoiceMap: Record<string, string> = {
  cs: "cs-CZ-AntoninNeural", // Czech
  en: "en-US-JennyNeural", // English (US)
  fr: "fr-FR-DeniseNeural", // French
  de: "de-DE-KatjaNeural", // German
  hi: "hi-IN-SwaraNeural", // Hindi
  ja: "ja-JP-NanamiNeural", // Japanese
  ko: "ko-KR-SunHiNeural", // Korean
  ph: "fil-PH-AngeloNeural", // Filipino
  ru: "ru-RU-DariyaNeural", // Russian
  es: "es-ES-ElviraNeural", // Spanish (Spain)
  "zh-Hans": "zh-CN-XiaoxiaoNeural", // Chinese (Simplified)
};

const RealTimeTranslation = ({
  audioStream,
  targetLanguage,
  inputLanguage,
  isTranslating,
}: RealTimeTranslationProps) => {
  const [translatedText, setTranslatedText] = useState("");
  const recognizerRef = useRef<SpeechSDK.TranslationRecognizer | null>(null);

  const speechTranslationConfig = useMemo(() => {
    const config = SpeechSDK.SpeechTranslationConfig.fromSubscription(
      import.meta.env.VITE_APP_AZURE_SPEECH_KEY as string,
      import.meta.env.VITE_APP_AZURE_SPEECH_REGION as string,
    );
    config.speechRecognitionLanguage = "en-US"; // Fixed input language for now
    config.addTargetLanguage(targetLanguage || "cs");
    return config;
  }, [targetLanguage]);

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
        setTranslatedText(translation || "");
      }
    };

    translationRecognizer.recognized = (_, event) => {
      if (event.result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
        const translation = event.result.translations.get(targetLanguage);
        setTranslatedText(translation || "");

        // Add SSML-based speech synthesis for translated text
        if (translation) {
          const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
            import.meta.env.VITE_APP_AZURE_SPEECH_KEY as string,
            import.meta.env.VITE_APP_AZURE_SPEECH_REGION as string,
          );
          speechConfig.speechSynthesisLanguage = targetLanguage; // Set synthesis language to target language

          // Select voice based on target language
          const voice =
            languageToVoiceMap[targetLanguage] || "en-US-JennyNeural";
          speechConfig.speechSynthesisVoiceName = voice;

          const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

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

          synthesizer.speakSsmlAsync(
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
              synthesizer.close();
            },
            (err) => {
              console.error("Speech synthesis error: ", err);
              synthesizer.close();
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
  }, [audioStream, speechTranslationConfig, targetLanguage]);

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
