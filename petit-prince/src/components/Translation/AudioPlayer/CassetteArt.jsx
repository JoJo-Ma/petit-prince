import React from 'react';
import { ReactComponent as CassetteKnob} from '../../svg/cassetteknob.svg'



const CassetteArt = ({currentId, length, isPlaying}) => {

  var cassetteLeftStyle = {
    margin:  (currentId/length * 4).toString() + "rem",
    borderWidth: ((1 - currentId/length) * 4).toString() + "rem"
  }
  var cassetteRightStyle = {
    borderWidth:  (currentId/length * 4).toString() + "rem",
    margin: ((1 - currentId/length) * 4).toString() + "rem"
  }

  return (
    <div className="cassette-cover">
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

export default CassetteArt;
