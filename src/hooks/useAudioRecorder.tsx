import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

function useAudioRecorder({ handleClose }: any) {
  const [scrollingWaveform, setScrollingWaveform] = useState(false);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<any>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const waveSurferRef = useRef<any>(null);
  const recordPluginRef = useRef<any>(null);
  const [progress, setProgress] = useState("");

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: "#mic",
      barWidth: 4,
    //   cursorWidth: 2,
      width: 133,
      backend: "WebAudio",
      height: 30,
      progressColor: "#2D5BFF",
      barGap: 2,
      waveColor: "#EFEFEF",
      cursorColor: "white",
      audioRate: 200,
      autoCenter: true,
      autoScroll: true,
      hideScrollbar: true,
      minPxPerSec: 100,
      barHeight: 30,
      barRadius: 10,
      normalize: true,
      dragToSeek: true,
    });

    // Initialize the Record plugin
    const recordPlugin = RecordPlugin.create({
      scrollingWaveform: true,
    //   audioBitsPerSecond: 3200000,
    scrollingWaveformWindow:1,
      renderRecordedAudio: true,
    });
    waveSurfer.registerPlugin(recordPlugin);
    waveSurferRef.current = waveSurfer;
    recordPluginRef.current = recordPlugin;

    // Event listener for record end
    recordPlugin.on("record-end", (blob) => {
      // handleSendRecording(blob);
      const recordedUrl = URL.createObjectURL(blob);
      setRecordedAudio(recordedUrl);
      handleClose();
    });
    recordPlugin.on("record-pause", (blob) => {
      const recordedUrl = URL.createObjectURL(blob);
      setRecordedAudio(recordedUrl);
    });

    // Event listener for recording progress
    recordPlugin.on("record-progress", (time) => {
      setRecordingTime(time);
      updateProgress(time);
    });

    return () => {
      waveSurfer.destroy();
    };
  }, [scrollingWaveform]);

  const updateProgress = (time: any) => {
    const formattedTime = [
      Math.floor((time % 3600000) / 60000), // minutes
      Math.floor((time % 60000) / 1000), // seconds
    ]
      .map((v) => (v < 10 ? "0" + v : v))
      .join(":");

    setProgress(formattedTime);
  };

  const handlePause = () => {
    if (recording && !paused) {
      recordPluginRef.current.pauseRecording();
      setPaused(true);
    } else {
      recordPluginRef.current.resumeRecording();
      setPaused(false);
    }
  };

  const handleRecord = () => {
    if (recording || paused) {
      recordPluginRef.current.stopRecording();
      setRecording(false);
      setPaused(false);
    } else {
      recordPluginRef.current.startRecording().then(() => {
        setRecording(true);
      });
    }
  };

  const handleCheckboxChange = (checked: any) => {
    setScrollingWaveform(checked);
  };

  return {
    recording,
    paused,
    recordedAudio,
    recordingTime,
    waveSurferRef,
    progress,
    handlePause,
    handleRecord,
    handleCheckboxChange,
    scrollingWaveform,
  };
}

export default useAudioRecorder;
