import React, {useState, useEffect, useRef} from 'react';

import { setupMic, convertBlobToAudioBuffer, play, convertWavToMp3, SAMPLE_RATE } from '../../Util/audio_util'
import {Buffer} from 'buffer'
import useFetchDiscardedAudio from './useFetchDiscardedAudio'
import { baseUrl } from '../../Util/apiUrl';

const AudioIssue = ({audiodata, ad_name, language, sentence, sentence_id, trans_desc_id, subtype, type, id}) => {
  const [message, setMessage] = useState('')
  const audioContext = useRef(null)
  const [hasToRecord, setHasToRecord] = useState(false)
  const { discardedAudiodata, triggerDiscardedReloadClick }  = useFetchDiscardedAudio(sentence_id, ad_name, trans_desc_id)


  const onMessageChange = (e) => {
    setMessage(e.target.value)
  }

  const handleCheckbox = () => {
    setHasToRecord(prev => !prev)
  }


  const getAudioContext = () => {
    //stop current recording playing to avoid duplicated sounds
    if (audioContext.current != null) {
      audioContext.current.close()
    }
    audioContext.current = new AudioContext({
      sampleRate: SAMPLE_RATE
    })
  }

  const playSentence = async () => {
    getAudioContext()
    var audioBuffer;
    if(audiodata) {
      const blob = new Blob([Buffer.from(audiodata, "7bit")],{ type: "audio/mp3" })
      audioBuffer = await convertBlobToAudioBuffer(blob, audioContext.current)
      play(audioBuffer, audioContext.current)
      return
    }
    if (discardedAudiodata) {
      console.log('ici dis');
      audioBuffer = await convertBlobToAudioBuffer(discardedAudiodata, audioContext.current)
      play(audioBuffer, audioContext.current)
    }
  }

  const discardAudio = async () => {
    try {
      const response = await fetch(`${baseUrl}/blobtesting/sentence-audio/discard/${sentence_id}/${ad_name}/${trans_desc_id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
        token : localStorage.token }
      })
      triggerDiscardedReloadClick()
    } catch (error) {
      console.error(error.message);
    }
  }

  const restoreAudio = async () => {
    try {
      const response = await fetch(`${baseUrl}/blobtesting/sentence-audio/restore/${sentence_id}/${ad_name}/${trans_desc_id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
        token : localStorage.token }
      })
      triggerDiscardedReloadClick()
    } catch (error) {
      console.error(error.message);
    }
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    const discardedMessage = discardedAudiodata ? "The sentence has been discarded." : ""
    const recordAgainMessage = hasToRecord ? "Please record the sentence again." : "You may record the sentence again."
    const messageIntro = `The following sentence you recorded in ${language} has been flagged for issue : ${sentence}`
    try {
      const body = {
        type:type,
        subtype:subtype,
        message: message + messageIntro + discardedMessage + recordAgainMessage,
        username: ad_name,
        id: id
      }
      console.log(JSON.stringify(body));
      const response = await fetch(`${baseUrl}/notifications/`,{
        method: "POST",
        headers:{
        "Content-Type": "application/json",
        token : localStorage.token
        },
        body: JSON.stringify(body)
      })
      console.log(response);
      const parseRes = await response.json()
      console.log(parseRes)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="">
      <p>Audio by <b>{ad_name}</b></p>
      <form onSubmit={onSubmitForm}>
        <div className="form__group input-form">
          <input className="form__field" type="text" value={message} name="name" style={{width:"100%"}} onChange={e => onMessageChange(e)} placeholder="Draft name" />
          <label for="name"  className="form__label">Message</label>
          <input type="checkbox" checked={hasToRecord} onChange={handleCheckbox} name="checkbox" />
          <label for="checkbox"  >Ask audio author to record again</label>
        </div>
        <div>
          <button>Send message</button>
        </div>
      </form>
      {
        discardedAudiodata &&

        <p>This audio has been discarded.</p>
      }
      <button className="" onClick={playSentence}>Play audio</button>
      {
        discardedAudiodata ?
        <>
        <button className="" onClick={restoreAudio}>Restore audio</button>
        </>
      :
      <>
      <button className="" onClick={discardAudio}>Discard audio</button>
      </>
  }
    </div>
  )
  }



export default AudioIssue;
