/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import '@/global.css';
import {AudioSourceProvider} from './components/_providers/AudioSourceProvider';
import Chats from './pages/Chats';

function App(): React.JSX.Element {
  return (
    <AudioSourceProvider>
      <Chats />
    </AudioSourceProvider>
  );
}

export default App;
