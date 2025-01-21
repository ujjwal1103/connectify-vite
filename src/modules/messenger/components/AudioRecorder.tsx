import { useEffect } from 'react'
import useAudioRecorder from '@/hooks/useAudioRecorder'

import { PiPauseCircle, PiPlay } from 'react-icons/pi'
import { Send, XIcon } from 'lucide-react'

const AudioRecorder = ({ handleClose, handleSendRecording }: any) => {
  const {
    paused,
    waveSurferRef,
    progress,
    handlePause,
    handleRecord,
    recordPluginRef,
  } = useAudioRecorder()

  useEffect(() => {
    handleRecord(false)
  }, [])

  const handleSend = () => {
    recordPluginRef.current.stopRecording()
    recordPluginRef.current?.on(
      'record-end',
      (blob: Blob) => {
        handleSendRecording(blob)
      },
      { once: true }
    )
  }

  return (
    <div className="relative flex w-full items-center gap-3 p-2">
      <button onClick={handleClose}>
        <XIcon size={24} />
      </button>

      <div className="ml-auto flex items-center gap-3">
        <button onClick={handlePause}>
          {paused ? <PiPlay size={24} /> : <PiPauseCircle size={34} />}
        </button>

        <div id="mic" ref={waveSurferRef} className="w-[140px]" />

        <div>
          <div id="progress">{progress}</div>
        </div>
        <button onClick={handleSend}>{<Send size={24} />}</button>
      </div>
    </div>
  )
}

export default AudioRecorder
