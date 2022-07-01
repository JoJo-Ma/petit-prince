import React from 'react'
import { ReactComponent as RecordButton} from '../svg/record.svg'
import { ReactComponent as StopButton} from '../svg/stop.svg'
import { ReactComponent as SaveButton} from '../svg/save.svg'
import { ReactComponent as BinButton} from '../svg/bin.svg'
import { ReactComponent as PlayButton} from '../svg/play.svg'
import { ReactComponent as PlayForwardNextButton} from '../svg/playforwardnext.svg'


const Instructions = () => {

    const styleSvg = {
        height:"1rem",
        width:"1rem",
        fill:"var(--cranberry)"
    }

    const styleUnsaved = {
        color:"orange"
    }

    const styleSaved = {
        color:"green"
    }


    return (
        <div className='instructions'>
        <h4>How to use</h4>
        <p>Select the <b>language</b> of the translation you want to record.</p>
        <p>Start recording each sentence with the record button. <RecordButton style={styleSvg}/></p> 
        <p>Stop recording with the stop button. <StopButton style={styleSvg}/></p>
        <p><b>Recorded but unsaved</b> sentences will be highlighted in <b style={styleUnsaved}>orange</b>.
        Click on the save button to save them. <SaveButton style={styleSvg}/></p>
        <p><b>Recorded and saved</b> sentences will be highlighted in <b style={styleSaved}>green</b>.</p>
        <p>Both saved and unsaved recorded sentences can be deleted with the delete button. <BinButton style={styleSvg}/></p>
        <p>You do not need to record everything in one session! When you come back for another round of recording, 
            click on <PlayForwardNextButton style={styleSvg}/> to move directly to the next unrecorded sentence.
        </p>
        <p>Check your recordings with the play button. <PlayButton style={styleSvg}/></p>
        <p>Save often. Have fun!</p>
      </div>
    )
}

export default Instructions