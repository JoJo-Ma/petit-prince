import React, { useEffect, useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import { useStoreState } from 'easy-peasy';

const SubmitDraft = ({data}) => {
  const [ languages, setLanguages] = useState([])
  const [ language, setLanguage] = useState("")
  const [ name, setName ] = useState("")
  const username = useStoreState(state => state.naming.name)

  useEffect( async () => {
    const response = await fetch ("http://localhost:3005/languages")

    const parseRes = await response.json()

    setLanguages(parseRes)
  }, [])

  const handleLanguageSelect = (lang) => {
    setLanguage(lang)
  }

  const onChange = (e) => {
    setName(e.target.value)
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const body = { username, language, data, name }
      const response = await fetch("http://localhost:3005/translations/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(body)
      })



    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
    <h4>Submit Draft</h4>
    <form onSubmit={onSubmitForm}>
      <label>
        <p>Draft name</p>
        <input type="text" value={name} name="name" onChange={e => onChange(e)} />
      </label>
      <label>
        <p>Language</p>
        <LanguageSelector selectLanguage={handleLanguageSelect} languages={languages}/>
      </label>
      <div>
      <button>Submit</button>
      </div>
    </form>
    </>
  )
}

export default SubmitDraft;
