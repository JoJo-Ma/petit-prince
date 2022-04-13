import React, { useState, useRef, useEffect } from 'react';
import "./Translation.css"

import useFetchAvailableRecording from '../Util/useFetchAvailableRecording'
import RecordingSelector from './AudioPlayer/RecordingSelector'
import { convertBlobToAudioBuffer, play } from '../Util/audio_util'
import {Buffer} from 'buffer'


const AudioPlayer = ({statusRecorder, updateStatus, language, languageId, setNext, currentId, setSentenceDuration, duration}) => {
  const [hidden, setHidden] = useState(false)
  const { usernames } = useFetchAvailableRecording(language)
  const [username, setUsername] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const isInitialMount = useRef(true);
  const audioContext = useRef(null)

  const toggleHidden = () => {
    setHidden(!hidden)
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3005/blobtesting/statusRecording/${username}/${language.name}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()
      const data = parseRes.map(el => { return el.sentence_id})
      updateStatus(data, 'NewRecordedAndInDb')
    }
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return
    }
    try {
      fetchData()
    } catch (error) {
      console.error(error.message);
    }
  }, [username])

  const selectUsername = (name) => {
    setUsername(name)
  }

  const handleClickNext = () => {
    setNext()
  }

  const classAudio =
    hidden
    ?
    'hidden'
    :
    'visible'

  const handlePlayStopClick = () => {
    if (isPlaying) {
      audioContext.current.close()
      audioContext.current = null
      setIsPlaying(false)
    } else {
      playSentence()
    }
  }

  const playSentence = async (id = currentId) => {
    getAudioContext()
    var audioBuffer;
    try {
      const response = await fetch(`http://localhost:3005/blobtesting/sentence-audio/${id}/${username}/${languageId}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()
      const blob = new Blob([Buffer.from(parseRes, "7bit")],{ type: "audio/wav" })
      audioBuffer = await convertBlobToAudioBuffer(blob, audioContext.current)
      setSentenceDuration(audioBuffer.duration)
      setIsPlaying(true)
      play(audioBuffer, audioContext.current)
    } catch (error) {
      console.error(error.message);
    }
  }


  // change isPlaying effect back to false once the recording is done playing
  useEffect(() => {
    if (!isPlaying) return
    const timer = setTimeout(() => {
      setIsPlaying(false)
      setHasNext(statusRecorder.recordedAndInDb.includes(currentId+1))
    }, duration * 1000)
    return () => clearTimeout(timer)
  }, [duration, isPlaying])

  // will start next recording if the next one is available
  useEffect(() => {
    if(hasNext && isAutoPlay) {
      playSentence(currentId+1)
      setNext()
      setHasNext(false)
    }
  }, [hasNext])


  const getAudioContext = () => {
    //stop current recording playing to avoid duplicated sounds
    if (audioContext.current != null) {
      audioContext.current.close()
    }
    audioContext.current = new AudioContext()
  }

  return (
    <div className={classAudio + " read-audioplayer"}>
      <h3>Audioplayer</h3>
      <h5>{isPlaying ? "Playing" : "Not playing"}</h5>
      {
        usernames.length > 0
        ?
        <>
        <RecordingSelector language={language} usernames={usernames} selectUsername={selectUsername} />
        <button type="button"
          onClick={() =>{handlePlayStopClick()}}>{!isPlaying ? "Play" : "Stop"}</button>
        </>
        :
        <p>{"No recording for this language yet. :'("}</p>
      }
      <button className='toggle-button' type="button" onClick={()=>toggleHidden()}>{hidden ? 'open' : 'close'}</button>
    </div>
  )
}

export default AudioPlayer;
