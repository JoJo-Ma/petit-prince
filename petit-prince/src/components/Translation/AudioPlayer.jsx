import React, { useState, useRef, useEffect } from 'react';
import "./Translation.css"

import useFetchAvailableRecording from '../audioUtil/useFetchAvailableRecording'
import RecordingSelector from './AudioPlayer/RecordingSelector'
import { convertBlobToAudioBuffer, play } from '../audioUtil/audio_util'
import {Buffer} from 'buffer'


const AudioPlayer = ({updateStatus, language, languageId, setNext, currentId, setSentenceDuration}) => {
  console.log(language);
  const [hidden, setHidden] = useState(false)
  const { usernames } = useFetchAvailableRecording(language)
  const [username, setUsername] = useState('')
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
        play(audioBuffer, audioContext.current)
      } catch (error) {
        console.error(error.message);
      }
    }

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
      {
        usernames.length > 0
        ?
        <>
        <RecordingSelector language={language} usernames={usernames} selectUsername={selectUsername} />
        <button type="button" onClick={handleClickNext}>Next</button>
        <button type="button"
          onClick={() => {playSentence(currentId)}}>Play sentence</button>
        </>
        :
        <p>{"No recording for this language yet. :'("}</p>
      }
      <button className='toggle-button' type="button" onClick={()=>toggleHidden()}>{hidden ? 'open' : 'close'}</button>
    </div>
  )
}

export default AudioPlayer;
