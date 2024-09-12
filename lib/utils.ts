export const getTimeReading = (startTime: number) => {
  const now = new Date().getTime();
  const duration = now - startTime;

  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  const minutesString =
    minutes <= 9 ? `${minutes}`.padStart(2, '0') : `${minutes}`;
  const secondsString =
    seconds <= 9 ? `${seconds}`.padStart(2, '0') : `${seconds}`;
  return {
    timeReading: `${minutesString}:${secondsString}`,
    minutes,
    seconds,
  };
};


export function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  // Convert 24-hour time to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Hour '0' should be '12'

  // Pad minutes with leading zero if needed
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  const currentTime = `${hours}:${minutesStr} ${ampm}`;
  return currentTime;
}



export const getMMSS = (mmssss:string) => {
  const [mm, ss, _] = mmssss.split(':');

  return `${mm}:${ss}`;
}
export enum PLAYSTATUS {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
  RESUMED = 'RESUMED',
  IDLE = 'IDLE',
}

export enum RECORDINGSTATUS {
  RECORDING = 'RECORDING',
  IDLE = 'IDLE',
  PAUSED = 'PAUSED',
}
