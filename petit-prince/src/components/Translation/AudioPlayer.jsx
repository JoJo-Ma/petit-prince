import React, { useState } from 'react';
import "./Translation.css"

import useFetchAvailableRecording from '../utilAudio/useFetchAvailableRecording'


const AudioPlayer = ({language}) => {
  const [hidden, setHidden] = useState(false)
  const { usernames } = useFetchAvailableRecording(language)
  const [username, setUsername] = useState('')

  const toggleHidden = () => {
    setHidden(!hidden)
  }

  const handleChange = (e) => {
    setUsername(e.target.value)
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
      <p>choose available recording for {language}</p>
      {
        usernames &&
        <select onChange={(e) => handleChange(e)}>
          <option value="" defaultValue hidden>Choose here</option>
          {usernames.map((username, index) => {
            return <option key={index} value={username.username}>{username.username}</option>
          })}
        </select>
      }
      <button className='toggle-button' type="button" onClick={()=>toggleHidden()}>{hidden ? 'open' : 'close'}</button>
    </div>
  )
}

export default AudioPlayer;
