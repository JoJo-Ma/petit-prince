import React, {useState, useEffect, useRef, useContext} from 'react';
import {RecorderContext} from './Record'
import useOnScreen from '../Util/useOnScreen'


import "./Recorder.css"



const DisplayText =  ({data, currentId, changeCurrentId, statusRecorder, duration}) => {
  const isInitialMount = useRef(true);
  const {username} = useContext(RecorderContext)
  const currentEl = useRef(null)
  const isOnScreen = useOnScreen(currentEl)


  const handleClick = async (id) => {
    changeCurrentId(id)
  }

  const handleWhiteSpace = (style) => {
    if (style === "dialogue") return ' '
    if (style === "dialogue end") return ' '
    if (style === "paragraph") return ' '
    if (style === "paragraph end") return ' '
    return ''
  }

  const handleBeginning = (style) => {
    if (style.includes('beginning')) {
      return <div className="clear"></div>
    }
    return ''
  }
  const handleEnd = (style) => {
    if (style.includes('end')) {
      return <div className="clear"></div>
    }
    return ''
  }
  const handleStyleSentences = (style, id) => {
    if (statusRecorder.recorded.includes(id)) {
      return `${style} languageOne recorded`
    }
    if (statusRecorder.recordedAndInDb.includes(id)) {
      return `${style} languageOne recordedAndInDb`
    }
    return `${style} languageOne`
  }


  // keep the current sentence visible in window, at around 1/3 to 1/2
  useEffect(() => {
    if (!currentEl.current) return
    if (!isOnScreen) {
      window.scrollTo({top:currentEl.current.offsetTop - window.innerHeight / 3, behavior:'smooth'})
    }
  },[currentId])

  return (
    <div className="translation" ref={undefined}>
      {
        data ?
        data.data.map((el, index) => {
          const addSpace = handleWhiteSpace(el.style)
          const addBeginning = handleBeginning(el.style)
          const addEnd = handleEnd(el.style)
          return ( <>
            {addBeginning}
            <div key={el.id}
              className={handleStyleSentences(el.style, el.id)}
              onClick={() => handleClick(el.id)}
              id={el.id === currentId ? 'current' : undefined}
              ref={el.id === currentId ? currentEl : undefined}
              >
              {addSpace + el.languageOne}
            </div>
            {addEnd}
          </>)
        }) : <p>toto</p>
      }
    </div>
  )
}

export default DisplayText;
