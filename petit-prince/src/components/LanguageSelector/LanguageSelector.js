import React, { useRef, useState, useEffect } from 'react';
import Select from 'react-select'
import useFetchLanguages from './useFetchLanguages'

const LanguageSelector = ({ selectLanguage, language, setLanguageFocus, focus, swap, setSwap }) => {
  const { languages } = useFetchLanguages()
  const languageRef = useRef()
  const [options, setOptions] = useState(null)

  const handleChange = (e) => {
    selectLanguage(languages.find(language => language.name === e.value))
    if(setLanguageFocus) setLanguageFocus(true)
  }

  useEffect(() => {
    if (swap) {
      languageRef.current.setValue({value:language.name, label:language.name})
      setSwap(false)
    }
  }, [swap])

  useEffect(() => {
    if (focus) {
      languageRef.current.focus()
      setLanguageFocus(false)
    }
  }, [focus])


  useEffect(() => {
    setOptions(languages.map((language) => { return {
        value: language.name, label: language.name}}))
  }, [languages])

  return (
    <Select className="react-select-container"
      classNamePrefix="react-select"
      ref={languageRef}
      options={options}
      onChange={(e) => handleChange(e)}
      placeholder={'Select language...'}
      theme={(theme) => ({
        ...theme,
        borderRadius:0,
        colors: {
          ...theme.colors,
          primary: '#408CA2',
          primary25: '#AFD8E5'
        }
      })}
      openMenuOnFocus={true}
       />
  )

}

export default LanguageSelector;
