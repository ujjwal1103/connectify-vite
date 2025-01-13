import { useEffect } from "react";
import useAudioRecorder from "@/hooks/useAudioRecorder";

import { PiPauseCircle, PiPlay } from "react-icons/pi";
import { Send, Trash2 } from "lucide-react";


const AudioRecorder = ({ handleClose, handleSendRecording }:any)=> {
  const {
    recording,
    paused,
    waveSurferRef,
    progress,
    handlePause,
    handleRecord,
  } = useAudioRecorder({handleSendRecording, handleClose});

  useEffect(() => {
    handleRecord();
  }, []);

  const handleSend = () => {
    recording && handleRecord()
  };

  return (
    <div className="py-2 px-4  relative flex gap-3 items-center justify-end">
      <button onClick={handleClose}>
        <Trash2 size={24} />
      </button>

      <button onClick={handlePause}>
        {paused ? <PiPlay size={24} /> : <PiPauseCircle size={34} />}
      </button>

      <div id="mic" ref={waveSurferRef}></div>

      <div>
        <div id="progress">{progress}</div>
      </div>
      <button onClick={handleSend}>{<Send size={24} />}</button>
    </div>
  );
}

export default AudioRecorder;
