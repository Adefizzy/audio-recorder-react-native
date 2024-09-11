import React from 'react';
import {AvatarFallbackText, AvatarImage, Avatar} from './ui/avatar';

export default function ProfileImage() {
  return (
    <Avatar className="h-14 w-14">
      <AvatarFallbackText>JD</AvatarFallbackText>
      <AvatarImage
        source={{
          uri: 'https://images.unsplash.com/photo-1620403724159-40363e84a155?q=80&w=2646&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        }}
      />
    </Avatar>
  );
}
