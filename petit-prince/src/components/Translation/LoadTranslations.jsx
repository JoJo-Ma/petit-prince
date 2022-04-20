import React, { useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'

const LoadTranslation = ({ loadData, selectLanguage }) => {
  const [languageOne, setLanguageOne] = useState(false)
  const [languageTwo, setLanguageTwo] = useState(false)
  const [focus, setFocus] = useState(false)
  const [swap, setSwap] = useState(false)

  const selectLanguageOne = (lang) => {
    setLanguageOne(lang)
  }

  const selectLanguageTwo = (lang) => {
    setLanguageTwo(lang)
  }

  const setLanguageFocus = (bool) => {
    setFocus(bool)
  }


  const handleClick = async (e) => {
    e.preventDefault()
    try {
      console.log(`http://localhost:3005/translations/${languageOne.name}/${languageTwo.name}`);
      const response = await fetch (`http://localhost:3005/translations/${languageOne.name}/${languageTwo.name}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()
      loadData(parseRes, languageOne)
    } catch (error) {
      console.error(error.message);
    }
  }

  const swapLanguages = () => {
    const one = languageOne
    setLanguageOne(languageTwo)
    setLanguageTwo(one)
    setSwap(true)
  }

  return (
      <div className="load-translation-container">
        <LanguageSelector selectLanguage={selectLanguageOne} language={languageOne} setLanguageFocus={setLanguageFocus} swap={swap} setSwap={setSwap}/>
        <FontAwesomeIcon className="icon-audio-player" icon={faArrowRightArrowLeft} onClick={swapLanguages}/>
        <LanguageSelector selectLanguage={selectLanguageTwo} language={languageTwo} focus={focus} setLanguageFocus={setLanguageFocus} swap={swap} setSwap={setSwap}/>
        <button type="button" disabled={(!languageOne || !languageTwo) && true } onClick={(e)=>handleClick(e)}>Load</button>
      </div>
  )

}

export default LoadTranslation;
