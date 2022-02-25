import React, {useState } from 'react';
import useFetchLanguages from './useFetchLanguages'

const LanguageSelector = ({ selectLanguage }) => {
  const { languages } = useFetchLanguages()


  const handleChange = (e) => {
    selectLanguage(e.target.value)
  }

  return (
    <select onChange={(e) => handleChange(e)}>
      {languages.map((language) => {
        return <option key={language.id} value={language.name}>{language.name}</option>
      })}
    </select>
  )

}

export default LanguageSelector;
