import React, {ReactNode} from 'react';
import {Box} from './ui/box';
import {HStack} from './ui/hstack';
import {Input, InputField} from './ui/input';
import {PingAnimation} from './RecordingIndicator';
import {Text} from '@/components/ui/text';

export default function ChatTextField({
  children,
  timeReading,
  isRecording,
}: {
  children?: ReactNode;
  timeReading: string;
  isRecording: boolean;
}) {
  return (
    <HStack
      space="md"
      className="bg-white w-full items-center relative py-4 rounded-t-md px-1">
      {!isRecording ? (
        <Box className="flex-1 mb-1">
          <Input variant="rounded" size="xl">
            <InputField placeholder="Enter Text here..." />
          </Input>
        </Box>
      ) : (
        <HStack
          space="lg"
          className="flex-1 rounded-full border border-slate-500 py-3 mb-1 px-6">
          <PingAnimation />
          <Text size="2xl">{timeReading} </Text>
        </HStack>
      )}
      <Box className="w-12  h-12" />
      <Box className="absolute right-0">{children}</Box>
    </HStack>
  );
}
