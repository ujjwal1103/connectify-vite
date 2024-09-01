import { HeadSet } from "@/components/icons"
import { useWaveProgress } from "@/hooks/useWaveProgress"
import { memo, useEffect } from "react"
import { FaPause, FaPlay } from "react-icons/fa"

const AudioPlayer = memo(({ src, getDurationAndCurrentTime }: any) => {
    const { containerRef, isPlaying, currentTime, onPlayPause, duration } =
      useWaveProgress(src)
  
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  
    useEffect(() => {
      const formatedTime = formatTime(currentTime)
      const formatedDuration = formatTime(duration)
      getDurationAndCurrentTime(formatedDuration, formatedTime)
    }, [duration, currentTime, getDurationAndCurrentTime])
  
    return (
      <div className="w-44 p-2 md:w-64">
        <div className="flex items-center gap-4">
          <button onClick={onPlayPause} className="rounded font-bold text-white">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <div className="relative flex w-96 flex-col">
            <div ref={containerRef} id="waveform" />
          </div>
  
          <div className="rounded-full bg-yellow-500 p-2">
            <HeadSet className="text-base" />
          </div>
        </div>
      </div>
    )
  })
  export { AudioPlayer }