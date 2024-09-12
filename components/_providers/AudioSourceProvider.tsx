import React, {createContext, ReactNode, useRef, useState} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

type AudioContextProps = {
  audioRecorderPlayer: React.MutableRefObject<AudioRecorderPlayer>;
  currentRecording?: string | null;
  setCurrentRecording: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AudioSourceContext = createContext<AudioContextProps | null>(null);

export const AudioSourceProvider = ({children}: {children: ReactNode}) => {
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const [currentRecording, setCurrentRecording] = useState<string | null>(null);

  return (
    <AudioSourceContext.Provider
      value={{
        audioRecorderPlayer,
        currentRecording,
        setCurrentRecording,
      }}>
      {children}
    </AudioSourceContext.Provider>
  );
};
