import React from 'react';
import {Pressable} from 'react-native';
import {PingAnimation} from './RecordingIndicator';
import {Box} from './ui/box';
import {HStack} from './ui/hstack';
import {VStack} from './ui/vstack';
import {Text} from '@/components/ui/text';
import {Icon} from './ui/icon';
import {Mic, Pause, Send, Trash2} from 'lucide-react-native';
import {Center} from './ui/center';

type Props = {
  isRecording: boolean;
  isPaused: boolean;
  timeReading: string;
  resumeRecording(): void;
  pauseRecording(): void;
  stopRecording(): void;
  resetCircle(): void;
};

export default function RecordingInterface({
  isPaused,
  isRecording,
  timeReading,
  resetCircle,
  resumeRecording,
  stopRecording,
  pauseRecording,
}: Props) {
  return (
    <VStack>
      {isRecording && !isPaused && (
        <Box className="w-full items-center justify-center pt-4 px-4 bg-white">
          <HStack space="md">
            <PingAnimation />
            <Text size="2xl">{timeReading} </Text>
          </HStack>
        </Box>
      )}
      <HStack
        space="md"
        className="w-full items-center justify-between  py-8 px-4 bg-white">
        <Pressable>
          <Icon as={Trash2} className="w-7 h-7 stroke-gray-500"  />
        </Pressable>

        <HStack space="lg">
          {isPaused ? (
            <Pressable onPress={resumeRecording}>
              <Icon as={Mic} className="w-7 h-7 stroke-primary-0" />
            </Pressable>
          ) : (
            <Pressable onPress={pauseRecording}>
              <Icon as={Pause} className="w-7 h-7 stroke-primary-0" />
            </Pressable>
          )}
        </HStack>

        <Pressable
          onPress={() => {
            stopRecording();
            resetCircle();
          }}>
          <Center className="bg-secondary-0 rounded-full p-4 h-14 w-14">
            <Icon as={Send} className="stroke-white w-7 h-7" />
          </Center>
        </Pressable>
      </HStack>
    </VStack>
  );
}
