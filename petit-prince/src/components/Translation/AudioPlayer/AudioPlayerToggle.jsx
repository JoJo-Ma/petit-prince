import React from 'react';
import { ReactComponent as CassetteTape} from '../../svg/cassettetape.svg'
import SvgButton from '../../Util/SvgButton'

const AudioPlayerToggle = ({setHidden, isAudioPlayerHidden}) => {

  const toggleHidden = () => {
    setHidden(!isAudioPlayerHidden)
  }

  return (
    <SvgButton className='toggle-button' onClick={()=>toggleHidden()} button={<CassetteTape />} alt={isAudioPlayerHidden? "Open player" : "Close player"} />
  )

}

export default AudioPlayerToggle;
