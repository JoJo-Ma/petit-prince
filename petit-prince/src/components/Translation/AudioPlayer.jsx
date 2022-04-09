import React, { useState, useRef, useEffect } from 'react';
import "./Translation.css"

import useFetchAvailableRecording from '../utilAudio/useFetchAvailableRecording'
import RecordingSelector from './AudioPlayer/RecordingSelector'

const AudioPlayer = ({language, updateStatus, setNext, currentId}) => {
  const [hidden, setHidden] = useState(false)
  const { usernames } = useFetchAvailableRecording(language)
  const [username, setUsername] = useState('')
  const isInitialMount = useRef(true);


  const toggleHidden = () => {
    setHidden(!hidden)
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3005/blobtesting/statusRecording/${username}/${language}`, {
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

  return (
    <div className={classAudio + " read-audioplayer"}>
      <h3>Audioplayer</h3>
      {
        usernames.length > 0
        ?
        <>
        <RecordingSelector language={language} usernames={usernames} selectUsername={selectUsername} />
        <button type="button" onClick={handleClickNext}>Next</button>
        </>
        :
        <p>{"No recording for this language yet. :'("}</p>
      }
      <button className='toggle-button' type="button" onClick={()=>toggleHidden()}>{hidden ? 'open' : 'close'}</button>
    </div>
  )
}

export default AudioPlayer;
