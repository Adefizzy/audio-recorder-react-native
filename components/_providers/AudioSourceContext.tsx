import { useContext } from "react";
import { AudioSourceContext } from "./AudioSourceProvider";


export const useAudioSourceContext = () => {
    const context = useContext(AudioSourceContext);
  
    if (!context) {
      console.error("Component must be within AudioSourceContext");
      throw Error("Component must be within AudioSourceContext");
    }
  
    return context;

}