import React, { useState, useEffect, useRef, useCallback } from 'react';
import { setupMic, stopMic } from './record_util'

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef(null);
  const mediaChunks = useRef([])
  const mediaStream = useRef(null)
  const [mediaBlodUrl, setMediaBlobUrl] = useState(null)

  const getMediaStream = useCallback(async () => {
    const audioStream = await window.navigator.mediaDevices.getUserMedia({
        type:'audio'} )
    mediaStream.current = audioStream;
  }, []);

  const startRecording = async (e) => {
    e.preventDefault()
    if (!mediaStream.curent) {
      mediaStream.current = await setupMic()
    }
    if (mediaStream.current) {
      const isStreamEnded = mediaStream.current
        .getTracks()
        .some((track) => track.readyState === "ended");
      if (isStreamEnded) {
        mediaStream.current = await setupMic()
        }

        // User blocked the permissions (getMediaStream errored out)
       if (!mediaStream.current.active) {
         return;
       }
       mediaRecorder.current = new MediaRecorder(mediaStream.current, {
            audioBitsPerSecond : 64000,
            mimeType: 'audio/webm;codecs=pcm',
        });
       mediaRecorder.current.ondataavailable = onRecordingActive;
       mediaRecorder.current.onstop = onRecordingStop;
       mediaRecorder.current.start();
       setIsRecording(true)
    }
  }

  const onRecordingActive = ({ data }) => {
    console.log('truggered brah');
    console.log(data);
    mediaChunks.current.push(data);
  };

  const onRecordingStop = () => {
    console.log('stop');
    const [chunk] = mediaChunks.current;
    console.log(chunk);
    const blob = new Blob(mediaChunks.current, { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    setIsRecording(false)
    setMediaBlobUrl(url);
    if (mediaStream.current) {
        const tracks = mediaStream.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
  };



  return (
    <>
      <h1>recorder</h1>
      <button type="button" onClick={startRecording}>Start</button>
      <button type="button" onClick={onRecordingStop}>Stop</button>
    </>
  )
}

export default Recorder;
