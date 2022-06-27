import React, {useState, useEffect, useRef} from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import useOnScreen from '../Util/useOnScreen'
import useFetchTransCustom from '../Util/useFetchTransCustom'
import 'react-lazy-load-image-component/src/effects/opacity.css';

function ClearSelection() {
    if (window.getSelection) window.getSelection().removeAllRanges();
    else if (document.selection) document.selection.empty();
}


const DisplayText =  ({data, pictures, currentId, changeCurrentId, statusRecorder, duration}) => {
  const [isHidden, setIsHidden] = useState([])
  const isInitialMount = useRef(true);
  const currentEl = useRef(null)
  const isOnScreen = useOnScreen(currentEl)
  const {transcription, mouse} = useFetchTransCustom()

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
        setIsHidden(new Array(data.data.length).fill(true,0))
    }
  }, [data])

  const handleClick = async (e,id) => {
    switch (e.detail) {
      case 1:
        changeCurrentId(id)
        break;
      case 2:
        e.preventDefault();
        setIsHidden(isHidden.map((el, index) => {
        return index === id ? !el : el
        }))
        ClearSelection()
        break;
      default:
      ClearSelection()
      changeCurrentId(id)

    }
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

  // keep the current sentence visible in window, at around 1/3 to 1/2
  useEffect(() => {
    if (!currentEl.current) return
    if (!isOnScreen) {
      window.scrollTo({top:currentEl.current.offsetTop - window.innerHeight / 3, behavior:'smooth'})
    }
  },[currentId])


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
                  onClick={(e) => handleClick(e, el.id)}
                  id={el.id === currentId ? 'current' : undefined}
                  ref={el.id === currentId ? currentEl : undefined}
                  lang={data.languageOne}
                  >
                  {addSpace + el.languageOne}
                </div>
                :
                <div key={el.id}
                  className={handleStyleSentences(el.style, el.id) + ' languageTwo'}
                  onClick={(e) => handleClick(e, el.id)}
                  id={el.id === currentId ? 'current' : undefined}
                  ref={el.id === currentId ? currentEl : undefined}
                  lang={data.languageTwo}
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

        }) : 
        <div className='instructions'>
          <h4>How to use</h4>
          <p><b>First</b>, select the <b>language you want to study</b>. The text will be paired with audio recordings of the book from other members.</p>
          <p>For <b>the second language</b>, select one you understand well to translate the sentences you are struggling with!</p>
        </div>
      }
      {
        transcription &&
        <span className='transcription-tooltip' style={{
          top:`${mouse.y - 10}px`,
          left:`${mouse.x + 5}px`
        }}>{transcription}</span>
      }
    </div>
  )
}

export default DisplayText;
