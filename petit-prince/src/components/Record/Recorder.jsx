import React, { useState, useEffect, useRef } from 'react';
import { setupMic } from './record_util'
import {Buffer} from 'buffer'

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef(null);
  const mediaChunks = useRef([])
  const mediaStream = useRef(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [newBlob, setNewBlob] = useState(null)
  const [id, setId] = useState('0')

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
            audioBitsPerSecond : 32000,
            mimeType: 'audio/webm;codecs=pcm',
        });
       mediaRecorder.current.ondataavailable = onRecordingActive;
       mediaRecorder.current.onstop = onRecordingStop;
       mediaRecorder.current.start();
       setIsRecording(true)
    }
  }

  const onRecordingActive = ({ data }) => {
    mediaChunks.current.push(data);
  };

  const onRecordingStop = () => {
    const [chunk] = mediaChunks.current;
    const blob = new Blob(mediaChunks.current, { type: "audio/wav" });
    setAudioBlob(blob)
    setIsRecording(false)
    if (mediaStream.current) {
        const tracks = mediaStream.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
  };

  const saveToDb = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob)
      const response = await fetch("http://localhost:3005/blobtesting", {
        method: "POST",
        body: formData
      })

      const parseRes = await response.json()
      setNewBlob(new Blob([Buffer.from(parseRes.data)],{ type: "audio/wav" }))
    } catch (error) {
      console.error(error.message);
    }
  }

  const loadFromDb = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch (`http://localhost:3005/blobtesting/${id}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()
      setNewBlob(new Blob([Buffer.from(parseRes, "7bit")],{ type: "audio/wav" }))
    } catch (e) {
    }
  }

  function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  })
}

  const onChangeId = (e) => {
    setId(e.target.value)
  }

  const convertBlobToAudioBuffer = (blob, context) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader()
      fileReader.onload = () => {
        const arrayBuffer = fileReader.result
        context.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer)
        })

      }

      fileReader.onerror = reject

      fileReader.readAsArrayBuffer(blob)
    })
  }

  const playSound = async () => {
    const audioContext = new AudioContext()
    const fileReader = new FileReader()
    var audioBuffer = await convertBlobToAudioBuffer(newBlob, audioContext)

    const play = (buffer) => {
      console.log(buffer);
      let sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = buffer
      sourceNode.connect(audioContext.destination)
      sourceNode.start(0)
    }
    play(audioBuffer)
    }



  return (
    <>
      <h1>recorder</h1>
      <button type="button" onClick={startRecording}>Start</button>
      <button type="button" onClick={onRecordingStop}>Stop</button>
      <button type="button" onClick={saveToDb}>Save to db</button>
      <input type="text" name="loadId" onChange={e => onChangeId(e)}/>
      <button type="button" onClick={loadFromDb}>Load db</button>
      <button type="button" onClick={playSound}>play sound</button>
    </>
  )
}

export default Recorder;
