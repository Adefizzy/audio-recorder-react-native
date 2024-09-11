import React from 'react';
import {Pressable} from 'react-native';
import {Box} from './ui/box';
import {HStack} from './ui/hstack';
import {Slider, SliderTrack, SliderFilledTrack, SliderThumb} from './ui/slider';
import {Text} from '@/components/ui/text';
//import useMediaPlayer from '@/hooks/useMediaPlayer';
import {PLAYSTATUS} from '@/lib/utils';
import {Pause, Play} from 'lucide-react-native';
import {Icon} from './ui/icon';
import useAudioPreview from '@/hooks/useAudioPreview';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

type Props = {
  filePath?: string | null;
  audioRecorderPlayer: AudioRecorderPlayer;
};

export default function AudioPreviewer({filePath, audioRecorderPlayer}: Props) {
  console.log('AudioPreviewer', filePath);

  const {
    playbackState,
    // currentPosition,
    // duration,
    startPlayback,
    pausePlayback,
    resumePlayback,
    //stopPlayback,
    sliderPercent,
    onSliderChange,
    playTime,
    recordingProps,
  } = useAudioPreview({audioRecorderPlayer});

  return (
    <HStack className="bg-white">
      <HStack className=" bg-gray-200 w-[90%] mx-auto items-center my-4 rounded-full py-3 px-4">
        {playbackState === PLAYSTATUS.PLAYING ? (
          <Pressable
            onPress={() => {
              pausePlayback();
            }}
            //className="z-50"
          >
            <Box>
              <Icon as={Pause} className="w-7 h-7 stroke-primary-0" />
            </Box>
          </Pressable>
        ) : (
          <Pressable
            // style={{zIndex: 1000, }}
            onPress={() => {
              if (playbackState === PLAYSTATUS.PAUSED) {
                console.log('AudioPreviewer 1', playbackState);
                resumePlayback();
              } else if (
                (playbackState === PLAYSTATUS.IDLE ||
                  recordingProps.isFinished) &&
                filePath
              ) {
                console.log('AudioPreviewer 2', playbackState);
                startPlayback(filePath);
              }
            }}
            //className="bg-black h-10 w-10"
          >
            <Box>
              <Icon as={Play} className="w-7 h-7 stroke-primary-0" />
            </Box>
          </Pressable>
        )}

        <Slider
          size="sm"
          minValue={0}
          onChange={onSliderChange}
          maxValue={100}
          value={sliderPercent}
          className="flex-1 mx-5">
          <SliderTrack className="bg-white">
            <SliderFilledTrack className="bg-secondary-0" />
          </SliderTrack>
          <SliderThumb size="lg" className="visible bg-secondary-0" />
        </Slider>

        <Box>
          <Text size="md">{playTime} </Text>
        </Box>
      </HStack>
    </HStack>
  );
}
