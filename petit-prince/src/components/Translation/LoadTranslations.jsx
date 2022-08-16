import React, { useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { ReactComponent as ArrowRightLeftButton} from '../svg/arrowrightleft.svg'
import { baseUrl } from '../Util/apiUrl';
import SvgButton from '../Util/SvgButton'

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
      const response = await fetch (`${baseUrl}/translations/${languageOne.name}/${languageTwo.name}`, {
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
        <SvgButton className="icon-audio-player" onClick={swapLanguages} alt={"Swap"} button={<ArrowRightLeftButton />} />
        <LanguageSelector selectLanguage={selectLanguageTwo} language={languageTwo} focus={focus} setLanguageFocus={setLanguageFocus} swap={swap} setSwap={setSwap}/>
        <button type="button" disabled={(!languageOne || !languageTwo) && true } onClick={(e)=>handleClick(e)}>Load</button>
      </div>
  )

}

export default LoadTranslation;
