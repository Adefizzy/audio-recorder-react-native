import React from 'react';
import {Pressable} from 'react-native';
import ProfileImage from './ProfileImage';
import {Box} from './ui/box';
import {HStack} from './ui/hstack';
import {Slider, SliderTrack, SliderFilledTrack, SliderThumb} from './ui/slider';
import {Icon} from './ui/icon';
import {Text} from '@/components/ui/text';
import {Pause, Play} from 'lucide-react-native';
import useMediaPlayer from '@/hooks/useMediaPlayer';
import {PLAYSTATUS} from '@/lib/utils';
import {VStack} from './ui/vstack';

export default function AudioPlayer({filePath, time}: {filePath: string, time: string}) {
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
    adjustPlaybackRate,
    playbackRate,
  } = useMediaPlayer({filePath});


  return (
    <VStack className="relative bg-secondary-0/25 w-[85%] ml-auto my-2 rounded-md  mr-4 h-20 px-4">
      <HStack className="h-full w-full items-center">
        {playbackState !== PLAYSTATUS.PLAYING ? (
          <ProfileImage />
        ) : (
          <Pressable
            onPress={adjustPlaybackRate}
            className="rounded-full w-20 py-1 bg-white flex justify-center items-center ">
            <Text size="xl" className="text-primary">
              {playbackRate}x{' '}
            </Text>
          </Pressable>
        )}

        {playbackState === PLAYSTATUS.PLAYING ? (
          <Pressable
            onPress={() => {
              pausePlayback();
              console.log('PAUSE')
            }}
            className="mx-5">
            <Box>
              <Icon
                as={Pause}
                className="fill-secondary-0 stroke-secondary-0 w-10 h-10"
              />
            </Box>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              if (playbackState === PLAYSTATUS.PAUSED) {
                resumePlayback();
                console.log('RESUME')
              } else if (
                playbackState === PLAYSTATUS.IDLE ||
                recordingProps.isFinished
              ) {
                if (filePath) {
                  startPlayback();
                  console.log('PLAYING')
                }
              }
            }}
            className="mx-5">
            <Box>
              <Icon
                as={Play}
                // size="xl"
                className="fill-secondary-0 stroke-secondary-0 w-10 h-10"
              />
            </Box>
          </Pressable>
        )}
        <Slider
          size="sm"
          minValue={0}
          onChange={onSliderChange}
          maxValue={100}
          value={sliderPercent}
          className="flex-1"
          >
          <SliderTrack className="bg-white">
            <SliderFilledTrack className="bg-secondary-0" />
          </SliderTrack>
          <SliderThumb size="lg" className="visible bg-secondary-0" />
        </Slider>
      </HStack>
      <HStack className="justify-between w-3/4 absolute right-0 bottom-1">
        <Text>{playTime}{' '}</Text>
        <Text>{time}{' '}</Text>
      </HStack>
    </VStack>
  );
}
