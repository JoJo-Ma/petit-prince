import React, { useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import { useStoreState } from 'easy-peasy';


export default ({data}) => {
  const [ language, setLanguage] = useState(false)
  const [ name, setName ] = useState("")
  const username = useStoreState(state => state.naming.name)

  const handleLanguageSelect = (lang) => {
    setLanguage(lang)
  }

  const onChange = (e) => {
    setName(e.target.value)
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const body = { username, language: language.name, data, name }
      const response = await fetch("http://localhost:3005/translations/", {
        method: "POST",
        headers: { "Content-Type": "application/json",
        token : localStorage.token },
        body: JSON.stringify(body)
      })


    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
    <h4>Submit Translation</h4>
    <form onSubmit={onSubmitForm}>
      <div className="form__group">
        <input className="form__field" type="text" value={name} name="name" style={{width:"100%"}} onChange={e => onChange(e)} placeholder="Translation name" />
        <label for="name"  className="form__label">Translation name</label>
      </div>
      <label>
        <p>Language</p>
        <LanguageSelector selectLanguage={handleLanguageSelect}/>
      </label>
      <div>
      <button disabled={!language}>Submit</button>
      </div>
    </form>
    </>
  )
}
