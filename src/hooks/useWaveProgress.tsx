import { useRef, useCallback, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

export const useWaveProgress = (audioUrl: string) => {
  const containerRef = useRef<any>(null);
  const [wavesurfer, setWaveSurfer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const ws = WaveSurfer.create({
        container: containerRef.current,
        height: 50,
        waveColor: "#b8b8b8",
        progressColor: "white",
        fillParent: true,
        cursorWidth:10,
        cursorColor:'yellow',
        minPxPerSec:10,
        barRadius: 5,
        url: audioUrl,
        autoScroll: true,
        barWidth: 4,
        dragToSeek: true,
        hideScrollbar: true,
        width: 150
      });

      setWaveSurfer(ws);

      ws.on("audioprocess", (time) => {
        setCurrentTime(time);
      });

      ws.on("ready", () => {
        setDuration(ws.getDuration());
      });

      ws.on("play", () => setIsPlaying(true));
      ws.on("pause", () => setIsPlaying(false));

      ws.on("finish", () => {
        setIsPlaying(false);
        ws.seekTo(0);
      });

      return () => {
        ws.destroy();
      };
    }
  }, [audioUrl]);

  // Play or pause the audio
  const onPlayPause = useCallback(() => {
    if (wavesurfer) {
      wavesurfer?.playPause();
    }
  }, [wavesurfer]);

  return {
    containerRef,
    isPlaying,
    currentTime,
    onPlayPause,
    duration,
  };
};
