import React, { useState, useEffect, useRef, useContext } from 'react';
import { setupMic, convertBlobToAudioBuffer, play, convertWavToMp3, SAMPLE_RATE } from '../Util/audio_util'
import {Buffer} from 'buffer'
import {RecorderContext} from './Record'
import SvgButton from '../Util/SvgButton'
import { ReactComponent as RecordButton} from '../svg/record.svg'
import { ReactComponent as StopButton} from '../svg/stop.svg'
import { ReactComponent as SaveButton} from '../svg/save.svg'
import { ReactComponent as BinButton} from '../svg/bin.svg'
import { ReactComponent as PlayButton} from '../svg/play.svg'
import { ReactComponent as PlayForwardButton} from '../svg/playforward.svg'
import { ReactComponent as PlayForwardNextButton} from '../svg/playforwardnext.svg'


import "./Recorder.css"
import { baseUrl } from '../Util/apiUrl';

const NEW = 'POST'
const UPDATE = 'PUT'


const Recorder = ({ setNext, setNextNonRecorded, currentId, languageId, statusRecorder, updateStatus, setSentenceDuration }) => {
  const [audioToDb, setAudioToDb] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef(null);
  const mediaChunks = useRef([])
  const mediaStream = useRef(null)
  const audioContext = useRef(null)
  const mp3encoder = useRef(null)
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
    audioContext.current = new AudioContext({
      sampleRate: SAMPLE_RATE
    })
  }

  const startRecording = async (e) => {
    e.preventDefault()
    if (isRecording) {
      return
    }
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
            mimeType: 'audio/webm;codecs=opus',
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
      getAudioContext();
      console.log(mediaChunks.current);
      convertWavToMp3(new Blob(mediaChunks.current, { type: "audio/wav" }), audioContext.current).then((blob) => {
          console.log(blob);
          setAudioToDb([...audioToDb, {
            audioblob: blob,
            sentenceId: currentId,
            type: typeOfRequest
          }])
        }
      )
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
    console.log(e);
    console.log(type);
    try {
      const formData = new FormData()
      for (let el of audioToDb.filter(audio => audio.type === type)) {
        formData.append("audio", el.audioblob)
        formData.append("sentence_id", el.sentenceId)
      }
      formData.append("language_id", languageId)
      formData.append("username", username)
      const response = await fetch(`${baseUrl}/blobtesting`, {
        method: type,
        body: formData,
        headers: {token : localStorage.token}
      })

      const parseRes = await response.json()
      console.log(parseRes.map(el => { return el.sentence_id}));
      setAudioToDb([])
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
      const response = await fetch(`${baseUrl}/blobtesting/sentence-audio/${id}/${username}/${languageId}`, {
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
      const response = await fetch(`${baseUrl}/blobtesting/sentence-audio/${id}/${username}/${languageId}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()
      const blob = new Blob([Buffer.from(parseRes, "7bit")],{ type: "audio/mp3" })
      console.log(blob);
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

    const handleClickNextNonRecorded = () => {
      setNextNonRecorded()
    }

    const disabledDeletePlay = !statusRecorder.recordedAndInDb.includes(currentId) &&
                !statusRecorder.recorded.includes(currentId) && true

    const disabledSave = !statusRecorder.recorded.includes(currentId) && true

  return (
    <div className="recorder">
      <h1>{isRecording ? 'Recording' : 'Not recording'}</h1>
      <div className="recorder-container">
        <SvgButton className={isRecording ? "button-recorder button-recorder--isrecording" : "button-recorder"}
          onClick={startRecording}
          disabled={isRecording}
          alt={"Start recording"}
          button={<RecordButton />} />
        <SvgButton className={"button-recorder"}
          onClick={!statusRecorder.recordedAndInDb.includes(currentId) ?
            (e) => {onRecordingStop(e,NEW)}
          :
            (e) => {onRecordingStop(e,UPDATE)}
        }
          disabled={!isRecording}
          alt={"Stop recording"}
          button={<StopButton />} />
        <SvgButton className={"button-recorder"}
          onClick={!statusRecorder.recordedAndInDb.includes(currentId) ?
            (e) =>  {saveToDb(e, NEW)}
            :
            (e) => {saveToDb(e,UPDATE)}
         }
          disabled={disabledSave} alt={"Save to db"} button={<SaveButton />} />
        <SvgButton className={"button-recorder"} onClick={(e) => {deleteRecording(e,currentId)}} disabled={disabledDeletePlay} alt={"Delete"} button={<BinButton />} />
        <SvgButton className={"button-recorder"} onClick={handleClickNext} alt={"Next"} button={<PlayForwardButton />} />
        <SvgButton className={"button-recorder"} onClick={handleClickNextNonRecorded} alt={"Next non recorded"} button={<PlayForwardNextButton />} />
        <SvgButton className={"button-recorder"} onClick={() => {playSentence(currentId)}} disabled={ disabledDeletePlay } alt={"Play"} button={<PlayButton />} />
      </div>

    </div>

  )
}

export default Recorder;
