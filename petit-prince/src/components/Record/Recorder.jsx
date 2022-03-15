import React, { useState, useEffect, useRef, useContext } from 'react';
import { setupMic, convertBlobToAudioBuffer, play } from './record_util'
import {Buffer} from 'buffer'
import {RecorderContext} from './Record'

import "./Recorder.css"

const Recorder = ({ setNext, currentId, languageId, statusRecorder }) => {
  const [audioToDb, setAudioToDb] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef(null);
  const mediaChunks = useRef([])
  const mediaStream = useRef(null)
  const [newBlob, setNewBlob] = useState(null)
  const {username} = useContext(RecorderContext)

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
    mediaChunks.current.push(data)
  };

  //TODO refactor to handle both post and put :)
  const onRecordingStop = () => {
    const blob = new Blob(mediaChunks.current, { type: "audio/wav" });
    setAudioToDb([...audioToDb, {
      audioblob: blob,
      sentenceId: currentId
    }])
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
      for (let el of audioToDb) {
        formData.append("audio", el.audioblob)
        formData.append("sentence_id", el.sentenceId)
      }
      formData.append("language_id", languageId)
      formData.append("username", username)
      const response = await fetch("http://localhost:3005/blobtesting", {
        method: "POST",
        body: formData
      })

      const parseRes = await response.json()
    } catch (error) {
      console.error(error.message);
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

  const updateInDb = async () => {
    const blob = new Blob(mediaChunks.current, { type: "audio/wav" });
    setIsRecording(false)
    if (mediaStream.current) {
        const tracks = mediaStream.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    try {
      const formData = new FormData()
      formData.append("audio", blob)
      formData.append("sentence_id", currentId)
      formData.append("language_id", languageId)
      formData.append("username", username)
      const response = await fetch("http://localhost:3005/blobtesting", {
        method: "PUT",
        body: formData
      })

      const parseRes = await response.json()
    } catch (error) {
      console.error(error.message);
    }
  }

  const playSentence = async (id = currentId) => {
    if (!statusRecorder.recordedAndInDb.includes(id)) return
    try {
      const response = await fetch(`http://localhost:3005/blobtesting/sentence-audio/${id}/${username}/${languageId}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()
      const blob = new Blob([Buffer.from(parseRes, "7bit")],{ type: "audio/wav" })
      const audioContext = new AudioContext()
      const fileReader = new FileReader()
      var audioBuffer = await convertBlobToAudioBuffer(blob, audioContext)

      play(audioBuffer, audioContext)
    } catch (error) {
      console.error(error.message);
    }
  }


    const handleClickNext = () => {
      setNext()
    }

  return (
    <div className="audioplayer">
      <h1>{isRecording ? 'Recording' : 'Not recording'}</h1>
      {
        !statusRecorder.recordedAndInDb.includes(currentId)
        ?
        <>
        <button type="button" onClick={startRecording}>Start</button>
        <button type="button" onClick={onRecordingStop}>Stop</button>
        <button type="button" onClick={saveToDb}>Save to db</button>
        </>
        :
        <>
        <button type="button" onClick={startRecording}>Rerecord</button>
        <button type="button" onClick={updateInDb}>Stopito</button>
        </>
      }
      <button type="button" onClick={handleClickNext}>Next</button>
      <button type="button" onClick={() => playSentence(currentId)}>Play sentence</button>
    </div>
  )
}

export default Recorder;
