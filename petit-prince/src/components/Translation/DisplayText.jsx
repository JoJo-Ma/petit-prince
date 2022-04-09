import React, {useState, useEffect, useRef} from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import 'react-lazy-load-image-component/src/effects/opacity.css';


const DisplayText =  ({data, pictures, currentId, changeCurrentId, statusRecorder, duration}) => {
  const [isHidden, setIsHidden] = useState([])
  const isInitialMount = useRef(true);
  const currentEl = useRef(null)


  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
        setIsHidden(new Array(data.data.length).fill(true,0))
    }
  }, [data])

  const handleClick = async (id) => {
    changeCurrentId(id)
    setIsHidden(isHidden.map((el, index) => {
      return index === id ? !el : el
    }))
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
      return <div className="empty"></div>
    }
    return ''
  }
  const handleEnd = (style) => {
    if (style.includes('end')) {
      return <div className="empty"></div>
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

  return (
    <div className="translation">
      {
        data ?
        data.data.map((el, index) => {
          const addSpace = handleWhiteSpace(el.style)
          const addBeginning = handleBeginning(el.style)
          const addEnd = handleEnd(el.style)
          const imgUrl = pictures.find(picture => picture.text_before_id === el.id)
          return ( <>
            {addBeginning}
            { isHidden[el.id]
                ?
                <div key={el.id}
                  className={handleStyleSentences(el.style, el.id) + ' languageOne'}
                  onClick={() => handleClick(el.id)}
                  id={el.id === currentId ? 'current' : undefined}
                  ref={el.id === currentId ? currentEl : undefined}
                  >
                  {addSpace + el.languageOne}
                </div>
                :
                <div key={el.id}
                  className={handleStyleSentences(el.style, el.id) + ' languageTwo'}
                  onClick={() => handleClick(el.id)}
                  id={el.id === currentId ? 'current' : undefined}
                  ref={el.id === currentId ? currentEl : undefined}
                  >
                  {addSpace + el.languageTwo}
                </div>
            }
            {addEnd}
              {
                imgUrl &&
                <div className="img">
                  <LazyLoadImage src={imgUrl.link} effect="opacity" />
                </div>
              }
          </>)
        }) : <p>toto</p>
      }
    </div>
  )
}

export default DisplayText;
