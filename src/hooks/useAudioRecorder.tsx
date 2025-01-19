import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'

function useAudioRecorder() {
  const [recording, setRecording] = useState(false)
  const [paused, setPaused] = useState(false)
  const waveSurferRef = useRef<any>(null)
  const recordPluginRef = useRef<any>(null)
  const [progress, setProgress] = useState('')

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: '#mic',
      barWidth: 4,
      width: 133,
      backend: 'WebAudio',
      height: 30,
      progressColor: '#2D5BFF',
      barGap: 2,
      waveColor: '#EFEFEF',
      cursorColor: 'white',
      audioRate: 200,
      autoCenter: true,
      autoScroll: true,
      hideScrollbar: true,
      minPxPerSec: 100,
      barHeight: 30,
      barRadius: 10,
      normalize: true,
      dragToSeek: true,
    })

    // Initialize the Record plugin
    const recordPlugin = RecordPlugin.create({
      scrollingWaveform: true,
      scrollingWaveformWindow: 1,
      renderRecordedAudio: true,
    })
    waveSurfer.registerPlugin(recordPlugin)
    waveSurferRef.current = waveSurfer
    recordPluginRef.current = recordPlugin

    // Event listener for recording progress
    const unSubscrib = recordPlugin.on('record-progress', (time) => {
      updateProgress(time)
    })

    return () => {
      waveSurfer.destroy()
      recordPlugin.destroy()
      unSubscrib()
    }
  }, [])

  const updateProgress = (time: any) => {
    const formattedTime = [
      Math.floor((time % 3600000) / 60000), // minutes
      Math.floor((time % 60000) / 1000), // seconds
    ]
      .map((v) => (v < 10 ? '0' + v : v))
      .join(':')

    setProgress(formattedTime)
  }

  const handlePause = () => {
    if (recording && !paused) {
      recordPluginRef.current.pauseRecording()
      setPaused(true)
    } else {
      recordPluginRef.current.resumeRecording()
      setPaused(false)
    }
  }

  const handleRecord = (isRecording: boolean) => {
    if (isRecording || paused) {
      recordPluginRef.current.stopRecording()
      setRecording(false)
      setPaused(false)
    } else {
      recordPluginRef.current.startRecording().then(() => {
        setRecording(true)
      })
    }
  }

  return {
    paused,
    waveSurferRef,
    progress,
    handlePause,
    handleRecord,
    recordPluginRef,
  }
}

export default useAudioRecorder
