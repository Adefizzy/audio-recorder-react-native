import {getMMSS, PLAYSTATUS} from '@/lib/utils';
import {useCallback, useEffect, useState} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import ReactNativeBlobUtil from 'react-native-blob-util';

type RecordProps = {
  currentPosition: number;
  duration: number;
  isFinished: boolean;
};

export default function useAudioPreview({
  audioRecorderPlayer,
}: {
  audioRecorderPlayer: AudioRecorderPlayer;
}) {
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
  const [playTime, setPlayTime] = useState<string>('00:00');

  const startPlayback = useCallback(
    async (filePath: string | undefined) => {
      try {
        console.log('startPlayback', filePath);
        if (filePath) {
          const fileExists = await ReactNativeBlobUtil.fs.exists(filePath);
          if (!fileExists) {
            console.error('File does not exist:', filePath);
            return;
          }

          console.log({fileExists});
          setPlaybackState(PLAYSTATUS.PLAYING);
          //await audioRecorderPlayer.pauseRecorder();
          await audioRecorderPlayer.startPlayer(filePath);
          console.log('Playback started: ', filePath);

          audioRecorderPlayer.addPlayBackListener(e => {
            if (e.isFinished) {
              setRecordingProps({...e, currentPosition: 0});
              setPlaybackState(PLAYSTATUS.IDLE);
              audioRecorderPlayer.stopPlayer();
              audioRecorderPlayer.removePlayBackListener();
            } else {
              setRecordingProps(e);
            }
          });
        }
      } catch (error) {
        console.error('Failed to start playback: ', error);
      }
    },
    [audioRecorderPlayer],
  );

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
}
