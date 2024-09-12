import {useAudioSourceContext} from '@/components/_providers/AudioSourceContext';
import {getMMSS, PLAYSTATUS} from '@/lib/utils';
import {useState, useEffect, useCallback, useRef} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

type RecordProps = {
  currentPosition: number;
  duration: number;
  isFinished: boolean;
};
const useMediaPlayer = ({filePath}: {filePath: string}) => {
  const [playbackState, setPlaybackState] = useState<PlayStatus>(
    PLAYSTATUS.IDLE,
  ); // 'idle', 'playing', 'paused'
  const [recordingProps, setRecordingProps] = useState<RecordProps>({
    currentPosition: 0,
    duration: 0,
    isFinished: false,
  });
  const [sliderPercent, setSliderPercent] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const {
    audioRecorderPlayer: previousAudioPlayer,
    setCurrentRecording,
    currentRecording,
  } = useAudioSourceContext();
  const [playTime, setPlayTime] = useState<string>('00:00');

  const startPlayback = useCallback(async () => {
    try {
      if (filePath) {
        if (currentRecording) {
          await previousAudioPlayer.current.stopPlayer();
          setCurrentRecording(null);
        }

        setPlaybackState(PLAYSTATUS.PLAYING);
        await audioRecorderPlayer.startPlayer(filePath);
        setCurrentRecording(filePath);
        previousAudioPlayer.current = audioRecorderPlayer;

        audioRecorderPlayer.addPlayBackListener(async e => {
          if (e.isFinished) {
            setRecordingProps({...e, currentPosition: 0});
            setPlaybackState(PLAYSTATUS.IDLE);
            await audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
          } else {
            setRecordingProps(e);
          }
        });
      }
    } catch (error) {
      console.error('Failed to start playback: ', error);
    }
  }, [
    audioRecorderPlayer,
    currentRecording,
    filePath,
    previousAudioPlayer,
    setCurrentRecording,
  ]);

  const pausePlayback = useCallback(async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
      setPlaybackState(PLAYSTATUS.PAUSED);
    } catch (error) {
      console.error('Failed to pause playback: ', error);
    }
  }, [audioRecorderPlayer]);

  const resumePlayback = useCallback(async () => {
    try {
      await audioRecorderPlayer.resumePlayer();
      setPlaybackState(PLAYSTATUS.PLAYING);
    } catch (error) {
      console.error('Failed to resume playback: ', error);
    }
  }, [audioRecorderPlayer]);

  const stopPlayback = useCallback(async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      setPlaybackState(PLAYSTATUS.IDLE);
      setSliderPercent(0);
      audioRecorderPlayer.removePlayBackListener();
    } catch (error) {
      console.error('Failed to stop playback: ', error);
    }
  }, [audioRecorderPlayer]);

  const getPlayPercent = useCallback(async () => {
    if (recordingProps.duration) {
      const playedPercent =
        (recordingProps.currentPosition / recordingProps.duration) * 100;

      if (playedPercent === 100) {
        /*  await stopPlayback();
        setRecordingProps(prev => ({
          ...prev,
          isFinished: true,
          currentPosition: 0,
        }));
        setPlaybackState(PLAYSTATUS.IDLE); */
      }
      setSliderPercent(playedPercent);
    } else {
      setSliderPercent(0);
    }
  }, [recordingProps.currentPosition, recordingProps.duration]);

  const onSliderChange = async (value: number) => {
    try {
      const currentPosition = (value / 100) * recordingProps.duration;
      if (!recordingProps.isFinished) {
        await audioRecorderPlayer.seekToPlayer(currentPosition);
        setRecordingProps(prev => ({...prev, currentPosition}));
      } else {
        await stopPlayback();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const adjustPlaybackRate = useCallback(async () => {
    try {
      if (playbackRate < 2) {
        const newPlaybackRate = playbackRate + 0.5;
        setPlaybackRate(newPlaybackRate);
        await audioRecorderPlayer.setPlaybackSpeed(newPlaybackRate);
      } else {
        setPlaybackRate(1);
        await audioRecorderPlayer.setPlaybackSpeed(1);
      }
    } catch (error) {
      console.error('Failed to adjust playback rate: ', error);
    }
  }, [audioRecorderPlayer, playbackRate]);

  const getPlayTime = useCallback(() => {
    const playTimeTemp = audioRecorderPlayer.mmssss(
      Math.floor(recordingProps.currentPosition),
    );

    setPlayTime(getMMSS(playTimeTemp));
  }, [audioRecorderPlayer, recordingProps.currentPosition]);

  useEffect(() => {
    getPlayPercent();
  }, [getPlayPercent]);

  useEffect(() => {
    getPlayTime();
  }, [getPlayTime]);

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [audioRecorderPlayer]);

  useEffect(() => {
    console.log({filePath, currentRecording, playbackState})
    if (currentRecording && filePath !== currentRecording && playbackState !== PLAYSTATUS.IDLE) {
      stopPlayback();
    }
  }, [filePath, currentRecording, stopPlayback, playbackState]);

  return {
    playbackState,
    recordingProps,
    startPlayback,
    pausePlayback,
    resumePlayback,
    stopPlayback,
    sliderPercent,
    onSliderChange,
    playTime,

    adjustPlaybackRate,
    playbackRate,
  };
};

export default useMediaPlayer;
