import React, {useState, useEffect, useRef} from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import 'react-lazy-load-image-component/src/effects/opacity.css';


const DisplayText =  ({data, pictures}) => {
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
                <div key={el.id} className={el.style + " languageOne"} onClick={() => toggle(el.id)}>
                  {addSpace + el.languageOne}
                </div>
                :
                <div key={el.id} className={el.style + " languageTwo"} onClick={() => toggle(el.id)}>
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
