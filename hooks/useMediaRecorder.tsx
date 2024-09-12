/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {Platform} from 'react-native';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import ReactNativeBlobUtil from 'react-native-blob-util';
// import useTimer from './useTimer';
import {getMMSS, RECORDINGSTATUS} from '@/lib/utils';
import useMediaPermission from './useMediaPermission';


const useMediaRecorder = () => {
  const {isPermissionGranted} = useMediaPermission();
  const [recordingState, setRecordingState] = useState<RecordingStatus>(
    RECORDINGSTATUS.IDLE,
  ); // 'idle', 'recording', 'paused'
  const recordedFileRef = useRef<string | null>();
  const [allRecordedFiles, setAllRecordedFiles] = useState<
    {id: number; path: string}[]
  >([]);
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const [recordTimeTracker, setTimeTracker] = useState<{
    recordSecs: number;
    recordTime: string;
    isRecording?: boolean;
  }>({recordSecs: 0, recordTime: '', isRecording: false});

  const audioSet = useMemo(
    () => ({
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVModeIOS: AVModeIOSOption.measurement,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    }),
    [],
  );

  const startRecording = useCallback(async () => {
    try {
      if (!isPermissionGranted) {
        console.log('PERMISSION NOT GRANTED');
        return;
      }
       const dirs = ReactNativeBlobUtil.fs.dirs;
      const path = Platform.select({
        ios: `file://${dirs.DocumentDir}/garaazaudio${allRecordedFiles.length}.m4a`,
        android: `${dirs.CacheDir}/garaazaudio${allRecordedFiles.length}.mp3`,
      });

     /*  const dirs = ReactNativeBlobUtil.fs.dirs;
      const path = Platform.select({
        ios: `file://${dirs.DocumentDir}/${uuidv4()}.m4a`,
        android: `${dirs.CacheDir}/${uuidv4()}.mp3`,
      }); */


      const result = await audioRecorderPlayer.startRecorder(path, audioSet);
      setRecordingState(RECORDINGSTATUS.RECORDING);
      recordedFileRef.current =  result;
      audioRecorderPlayer.addRecordBackListener(e => {
        setTimeTracker({
          recordSecs: e.currentPosition,
          recordTime: getMMSS(
            audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
          ),
          isRecording: e.isRecording,
        });
      });
    } catch (error) {
      console.error('Failed to start recording: ', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRecordedFiles.length, isPermissionGranted]);

  const pauseRecording = useCallback(async () => {
    try {
      await audioRecorderPlayer.pauseRecorder();
      setRecordingState(RECORDINGSTATUS.PAUSED);
    } catch (error) {
      console.error('Failed to pause recording: ', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRecorderPlayer]);

  const resumeRecording = useCallback(async () => {
    try {
      await audioRecorderPlayer.resumeRecorder();
      setRecordingState(RECORDINGSTATUS.RECORDING);
      //resumeTimer();
    } catch (error) {
      console.error('Failed to resume recording: ', error);
    }
  }, [audioRecorderPlayer]);

  const stopRecording = useCallback(async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      console.log('stopRecording', result);
      setRecordingState(RECORDINGSTATUS.IDLE);
      recordedFileRef.current =  null;
      let newMedia = {
        id: allRecordedFiles.length + 1,
        path: result,
      };
      setAllRecordedFiles([newMedia, ...allRecordedFiles]);
      audioRecorderPlayer.removeRecordBackListener();
      //stopTimer();
    } catch (error) {
      console.error('Failed to stop recording: ', error);
    }
  }, [allRecordedFiles]);

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
    };
  }, [audioRecorderPlayer]);

  return {
    recordingState,
    recordedFile: recordedFileRef.current,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    recordTimeTracker,
    allRecordedFiles,
    audioRecorderPlayer,
  };
};

export default useMediaRecorder;
