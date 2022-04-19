import React, { useState, useRef, useEffect } from 'react';
import "../Translation.css"
import "./AudioPlayer.css"

import useFetchAvailableRecording from '../../Util/useFetchAvailableRecording'
import RecordingSelector from './RecordingSelector'
import { convertBlobToAudioBuffer, play } from '../../Util/audio_util'
import {Buffer} from 'buffer'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as CassetteKnob} from './cassetteknob.svg'

const AudioPlayer = ({statusRecorder, updateStatus, language, languageId, setNext, currentId, setSentenceDuration, duration, length}) => {
  const [hidden, setHidden] = useState(false)
  const { usernames } = useFetchAvailableRecording(language)
  const [username, setUsername] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [triggerSentence, setTriggerSentence] = useState(false)
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
    const timer = setTimeout( () => {
      setHasNext(statusRecorder.recordedAndInDb.includes(currentId+1))
      setTriggerSentence(!triggerSentence)
    }, duration * 1000)
    return () => clearTimeout(timer)
  }, [duration, isPlaying])

  // will start next recording if the next one is available
  useEffect(() => {
    console.log('check');
    if(!isAutoPlay || !hasNext) {
      setIsPlaying(false)
    }
    if(hasNext && isAutoPlay) {
      playSentence(currentId+1)
      setNext()
    }
  }, [triggerSentence])


  const getAudioContext = () => {
    //stop current recording playing to avoid duplicated sounds
    if (audioContext.current != null) {
      audioContext.current.close()
    }
    audioContext.current = new AudioContext()
  }

  const handleCheck = () => {
    setIsAutoPlay(!isAutoPlay)
  }

  var cassetteLeftStyle = {
    margin:  (currentId/length * 4).toString() + "rem",
    borderWidth: ((1 - currentId/length) * 4).toString() + "rem"
  }
  var cassetteRightStyle = {
    borderWidth:  (currentId/length * 4).toString() + "rem",
    margin: ((1 - currentId/length) * 4).toString() + "rem"
  }


  return (
    <div className={classAudio + " read-audioplayer"}>
      <h3>Audioplayer</h3>
      {
        usernames.length > 0
        ?
        <div className='audioplayer-container'>
        <RecordingSelector language={language} usernames={usernames} selectUsername={selectUsername} />
        {isPlaying ?
          <FontAwesomeIcon className="icon-audio-player" icon={faPause} onClick={() =>{handlePlayStopClick()}} />
          :
          <FontAwesomeIcon className="icon-audio-player" icon={faPlay} onClick={() =>{handlePlayStopClick()}} />
        }
        {
          isAutoPlay ?
            <FontAwesomeIcon className="icon-audio-player" icon={faToggleOn} onClick={handleCheck} />
          :
            <FontAwesomeIcon className="icon-audio-player" icon={faToggleOff} onClick={handleCheck} />
        }
        <p for="checkbox">Autoplay</p>
        </div>
        :
        <p>{"No recording for this language yet. :'("}</p>
      }
      <button className='toggle-button' type="button" onClick={()=>toggleHidden()}>{hidden ? 'open' : 'close'}</button>
      <div className={isPlaying? "cassette active": "cassette"}>
      <div className="cassette-left"
      style={cassetteLeftStyle}>
      <CassetteKnob />
      </div>
      <div className="cassette-right"
      style={cassetteRightStyle}
      >
      <CassetteKnob />
      </div>
      </div>
    </div>
  )
}

export default AudioPlayer;
