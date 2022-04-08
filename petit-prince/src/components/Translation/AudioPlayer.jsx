import React, { useState } from 'react';
import "./Translation.css"


const AudioPlayer = ({language}) => {
  const [hidden, setHidden] = useState(false)

  const toggleHidden = () => {
    setHidden(!hidden)
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
      <p>{language}</p>
      <button className='toggle-button' type="button" onClick={()=>toggleHidden()}>{hidden ? 'open' : 'close'}</button>
    </div>
  )
}

export default AudioPlayer;
