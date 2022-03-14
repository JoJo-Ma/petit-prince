import React, {useState, useEffect, useRef} from 'react';


import "./Recorder.css"


const DisplayText =  ({data, currentId, changeCurrentId, statusRecorder}) => {
  const [isHidden, setIsHidden] = useState([])
  const isInitialMount = useRef(true);



  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
        setIsHidden(new Array(data.data.length).fill(true,0))
    }
  }, [data])

  const toggle = (id) => {
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
  const handleStyleSentences = (id) => {
    let style = undefined
    if (statusRecorder.recorded.includes(id)) {
      return "recorded"
    }
    if (statusRecorder.recordedAndInDb.includes(id)) {
      return "recordedAndInDb"
    }
    return style
  }

  return (
    <div className="translation">
      {
        data ?
        data.data.map((el, index) => {
          const addSpace = handleWhiteSpace(el.style)
          const addBeginning = handleBeginning(el.style)
          const addEnd = handleEnd(el.style)
          return ( <>
            {addBeginning}
            <p key={el.id}
              className={el.id === currentId ? el.style + " languageOne current" : el.style + " languageOne"}
              onClick={() => toggle(el.id)}
              id={handleStyleSentences(el.id)}
              >
              {addSpace + el.languageOne}
            </p>
            {addEnd}
          </>)
        }) : <p>toto</p>
      }
    </div>
  )
}

export default DisplayText;
