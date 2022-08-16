import { useEffect, useState } from 'react';

import {Buffer} from 'buffer'
import { baseUrl } from '../../Util/apiUrl';

const useFetchDiscardedAudio = (sentence_id, username, trans_desc_id) => {
  const [ discardedAudiodata, setDiscardedAudiodata] = useState([])
  const [click, setClick] = useState(false)

  const triggerDiscardedReloadClick = () => {
    setClick(prev => !prev)
  }

  useEffect( () => {
    const abortController = new AbortController()
    const fetchData = async () => {
      const response = await fetch (`${baseUrl}/blobtesting/sentence-audio/discard/${sentence_id}/${username}/${trans_desc_id}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()
      if (parseRes.length === 0) {
        setDiscardedAudiodata(null)
        return
      } else {
        setDiscardedAudiodata(new Blob([Buffer.from(parseRes, "7bit")],{ type: "audio/mp3" }))
      }
    }
    fetchData()

    return function cleanup() {
      abortController.abort()
    }
  }, [click])

  return { discardedAudiodata, triggerDiscardedReloadClick }
}

export default useFetchDiscardedAudio;
