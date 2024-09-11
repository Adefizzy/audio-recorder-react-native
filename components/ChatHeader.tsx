import React from 'react';
import ProfileImage from './ProfileImage';
import { Box } from './ui/box';
import { HStack } from './ui/hstack';
import { Text } from '@/components/ui/text';

export default function ChatHeader() {
  return (
    <HStack space="md" className=" items-center py-6 bg-primary-0 px-6">
      <ProfileImage />
      <Box>
        <Text size="2xl" className="text-white">
          Distributor{' '}
        </Text>
      </Box>
    </HStack>
  );
}
