/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import '@/global.css';
import {GluestackUIProvider} from '@/components/ui/gluestack-ui-provider';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import {CustomColors} from './constants/Colors';
import ChatHeader from './components/ChatHeader';
import {Box} from './components/ui/box';
import AudioPreviewer from './components/AudioPreviewer';
import RecordingInterface from './components/RecordingInterface';
import ChatTextField from './components/ChatTextField';
import {DraggableCircle} from './components/DraggableBox';
import AudioPlayer from './components/AudioPlayer';
import useMediaRecorder from './hooks/useMediaRecorder';
import {RECORDINGSTATUS} from './lib/utils';
import {useDraggableCircle} from './hooks/useDraggableCircle';

function App(): React.JSX.Element {
  const {
    recordingState,
    recordedFile,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    recordTimeTracker,
    allRecordedFiles,
    audioRecorderPlayer,
  } = useMediaRecorder();

  const {
    resetCircle,
    isTouching,
    isVisible,
    // isDragging,
    pan,
    scale,
    size,
    panResponder,
    opacity,
  } = useDraggableCircle({stopRecording, startRecording});

  // const windowDimention = useWindowDimensions();

  /* const isDarkMode = useColorScheme() === 'light';
 
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }; */

  return (
    <GluestackUIProvider mode="light">
      <SafeAreaView
        className="flex-1 bg-slate-200" /* style={Colors.lighter} */
      >
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={CustomColors.light.primaryDark}
          className="text-white"
        />
        <ChatHeader />

        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          /* keyboardVerticalOffset={
            Platform.OS === 'ios' ? 0 : windowDimention.height * 0.1
          } */
        >
          <FlatList
            inverted={true}
            style={{
              flex: 1, // Take up the rest of the space
            }}
            data={allRecordedFiles}
            renderItem={({item}) => <AudioPlayer filePath={item.path} />}
            keyExtractor={item => `${item.id}`}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          />

          <Box className="h-fit">
            {recordingState === RECORDINGSTATUS.PAUSED && (
              <AudioPreviewer
                audioRecorderPlayer={audioRecorderPlayer}
                filePath={recordedFile}
              />
            )}
            {!isVisible && (
              <RecordingInterface
                isPaused={recordingState === RECORDINGSTATUS.PAUSED}
                isRecording={recordingState === RECORDINGSTATUS.RECORDING}
                pauseRecording={pauseRecording}
                timeReading={recordTimeTracker?.recordTime ?? ''}
                resumeRecording={resumeRecording}
                stopRecording={stopRecording}
                resetCircle={resetCircle}
              />
            )}
            {isVisible && (
              <ChatTextField
                isRecording={recordingState === RECORDINGSTATUS.RECORDING}
                timeReading={recordTimeTracker?.recordTime ?? ''}>
                <DraggableCircle
                  pan={pan}
                  scale={scale}
                  opacity={opacity}
                  size={size}
                  panResponder={panResponder}
                  isVisible={isVisible}
                  isTouching={isTouching}
                />
              </ChatTextField>
            )}
          </Box>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}

export default App;
