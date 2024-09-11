import { getTimeReading } from '@/lib/utils';
import { useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useTimer() {
  const tickerRef = useRef<NodeJS.Timeout | null>(null);
  const startRef = useRef<number | null>(null);

  const [timeReadingProps, setTimeReadingProps] = useState({
    minutes: 0,
    seconds: 0,
    timeReading: '00:00',
  });

  const timer = (startTime: number) => {
    const timerId = setInterval(() => {
      const { minutes, seconds, timeReading } = getTimeReading(startTime);
      setTimeReadingProps({ minutes, seconds, timeReading });
    }, 1000);

    tickerRef.current = timerId;
  };

  const startTimer = () => {
    const currentTime = new Date().getTime();
    startRef.current = currentTime;
    timer(currentTime);
  };

  const stopTimer = async () => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
    }
    startRef.current = null;
    await AsyncStorage.removeItem('paused');
    setTimeReadingProps({ minutes: 0, seconds: 0, timeReading: '00:00' });
  };

  const pauseTimer = async () => {
    if (startRef.current) {
      const pausedTime = new Date().getTime() - startRef.current;
      await AsyncStorage.setItem('paused', pausedTime.toString());
    }

    if (tickerRef.current) {
      clearInterval(tickerRef.current);
    }
  };

  const resumeTimer = async () => {
    const pausedTime = await AsyncStorage.getItem('paused');
    if (pausedTime) {
      const newStartTime = new Date().getTime() - parseInt(pausedTime, 10);
      startRef.current = newStartTime;
      timer(newStartTime);
    }
  };

  return {
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    timeReadingProps,
  };
}
