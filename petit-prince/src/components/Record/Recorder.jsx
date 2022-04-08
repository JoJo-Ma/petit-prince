import React, { useState, useEffect, useRef, useContext } from 'react';
import { setupMic, convertBlobToAudioBuffer, play } from './record_util'
import {Buffer} from 'buffer'
import {RecorderContext} from './Record'

import "./Recorder.css"

const NEW = 'POST'
const UPDATE = 'PUT'

const Recorder = ({ setNext, currentId, languageId, statusRecorder, updateStatus, setSentenceDuration }) => {
  const [audioToDb, setAudioToDb] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef(null);
  const mediaChunks = useRef([])
  const mediaStream = useRef(null)
  const audioContext = useRef(null)
  const {username} = useContext(RecorderContext)
  const [typeOfRequest, setTypeOfRequest] = useState('')

  useEffect(() => {
    if (!statusRecorder.recordedAndInDb.includes(currentId)) {
      setTypeOfRequest(NEW)
    } else {
      setTypeOfRequest(UPDATE)
    }
  }, [currentId])

  const getAudioContext = () => {
    //stop current recording playing to avoid duplicated sounds
    if (audioContext.current != null) {
      audioContext.current.close()
    }
    audioContext.current = new AudioContext()
  }

  const startRecording = async (e) => {
    e.preventDefault()
    if (!mediaStream.curent) {
      //reset chunks for the next recording
      mediaChunks.current = []
      mediaStream.current = await setupMic()
    }
    if (mediaStream.current) {
      const isStreamEnded = mediaStream.current
        .getTracks()
        .some((track) => track.readyState === "ended");
      if (isStreamEnded) {
        console.log('hey coco');
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

  //TODO find a way to slice recording
  const onRecordingStop = (e) => {
      const blob =new Blob(mediaChunks.current, { type: "audio/wav" });
      setAudioToDb([...audioToDb, {
        audioblob: blob,
        sentenceId: currentId,
        type: typeOfRequest
      }])
      updateStatus([currentId], "AddRecorded")
      setIsRecording(false)
      if (mediaStream.current) {
        const tracks = mediaStream.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
      setNext()
  };


  const saveToDb = async (e, type) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      for (let el of audioToDb.filter(audio => audio.type === type)) {
        formData.append("audio", el.audioblob)
        formData.append("sentence_id", el.sentenceId)
      }
      formData.append("language_id", languageId)
      formData.append("username", username)
      const response = await fetch("http://localhost:3005/blobtesting", {
        method: type,
        body: formData
      })

      const parseRes = await response.json()
      console.log(parseRes.map(el => { return el.sentence_id}));
      updateStatus(parseRes.map(el => { return el.sentence_id}), 'AddRecordedAndInDb')
    } catch (error) {
      console.error(error.message);
    }
  }

  const deleteRecording = async (e, id=currentId) => {
    e.preventDefault()
    if (statusRecorder.recorded.includes(id)) {
      setAudioToDb(audioToDb.filter(audio => audio.sentenceId !== id))
      updateStatus(statusRecorder.recorded.filter(el => el !== id),"DeleteRecorded")
    return
    }
    try {
      const response = await fetch(`http://localhost:3005/blobtesting/sentence-audio/${id}/${username}/${languageId}`, {
        method: "DELETE",
        headers: {token : localStorage.token}
      })
      console.log('test');
      updateStatus(statusRecorder.recordedAndInDb.filter(el => el !== currentId),"DeleteRecordedAndInDb")
    } catch (error) {

    }
  }

  const playSentence = async (id = currentId) => {
    getAudioContext()
    var audioBuffer;
    if (statusRecorder.recorded.includes(id)) {
      audioBuffer = await convertBlobToAudioBuffer(audioToDb.filter(obj => obj.sentenceId === id)[0].audioblob, audioContext.current)
      setSentenceDuration(audioBuffer.duration)
      play(audioBuffer, audioContext.current)
    return
    }
    try {
      const response = await fetch(`http://localhost:3005/blobtesting/sentence-audio/${id}/${username}/${languageId}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()
      const blob = new Blob([Buffer.from(parseRes, "7bit")],{ type: "audio/wav" })
      audioBuffer = await convertBlobToAudioBuffer(blob, audioContext.current)
      setSentenceDuration(audioBuffer.duration)
      play(audioBuffer, audioContext.current)
    } catch (error) {
      console.error(error.message);
    }
  }


    const handleClickNext = () => {
      setNext()
    }

    const disabledDeletePlay = !statusRecorder.recordedAndInDb.includes(currentId) &&
                !statusRecorder.recorded.includes(currentId) && true

    const disabledSave = !statusRecorder.recorded.includes(currentId)&& true

  return (
    <div className="audioplayer">
      <h1>{isRecording ? 'Recording' : 'Not recording'}</h1>
      {
        !statusRecorder.recordedAndInDb.includes(currentId)
        ?
        <>
        <button type="button"
         disabled = { isRecording && true }
         onClick={startRecording}>Start</button>
        <button type="button"
          disabled = { !isRecording && true }
          onClick={(e) => {onRecordingStop(e,NEW)}}>Stop</button>
        <button type="button"
          disabled={ disabledSave }
          onClick={(e) => {saveToDb(e, NEW)}}>Save to db</button>
        </>
        :
        <>
        <button type="button" disabled = { isRecording && true } onClick={startRecording}>Rerecord</button>
        <button type="button" disabled = { !isRecording && true } onClick={(e) => {onRecordingStop(e,UPDATE)}}>Stopito</button>
        <button type="button"
        disabled={ disabledSave }
        onClick={(e) => {saveToDb(e,UPDATE)}}>Save update to db</button>

        </>
      }
      <button type="button"
        disabled={ disabledDeletePlay }
        onClick={(e) => {deleteRecording(e,currentId)}}>Delete</button>
      <button type="button" onClick={handleClickNext}>Next</button>
      <button type="button"
        disabled={ disabledDeletePlay }
        onClick={() => {playSentence(currentId)}}>Play sentence</button>
    </div>

  )
}

export default Recorder;
