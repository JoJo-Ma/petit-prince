import React, { useRef, useEffect } from 'react';
import useFetchLanguages from './useFetchLanguages'

const LanguageSelector = ({ selectLanguage, language }) => {
  const { languages } = useFetchLanguages()
  const languageRef = useRef()

  const handleChange = (e) => {
    selectLanguage(e.target.value)
  }

  useEffect(() => {
    languageRef.current.value = language
  }, [language])

  return (
    <select ref={languageRef} onChange={(e) => handleChange(e)}>
      <option value="" defaultValue hidden>Choose here</option>
      {languages.map((language) => {
        return <option key={language.id} value={language.name}>{language.name}</option>
      })}
    </select>
  )

}

export default LanguageSelector;
