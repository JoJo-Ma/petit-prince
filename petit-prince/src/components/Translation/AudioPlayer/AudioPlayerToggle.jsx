import React from 'react';
import { ReactComponent as CassetteTape} from './cassettetape.svg'


const AudioPlayerToggle = ({setHidden, isAudioPlayerHidden}) => {

  const toggleHidden = () => {
    setHidden(!isAudioPlayerHidden)
  }

  return (
    <div className='toggle-button'
    onClick={()=>toggleHidden()}>
      <CassetteTape />
    </div>
  )

}

export default AudioPlayerToggle;
