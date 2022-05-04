import React, { useEffect, useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import { useStoreState } from 'easy-peasy';

const SubmitDraft = ({data}) => {
  const [ language, setLanguage] = useState("")
  const [ name, setName ] = useState("")
  const username = useStoreState(state => state.naming.name)


  const handleLanguageSelect = (lang) => {
    setLanguage(lang.name)
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
    <h4>Submit Draft</h4>
    <form onSubmit={onSubmitForm}>
      <div className="form__group">
        <input className="form__field" type="text" value={name} name="name" style={{width:"100%"}} onChange={e => onChange(e)} placeholder="Draft name" />
        <label for="name"  className="form__label">Draft name</label>
      </div>
      <label>
        <p>Language</p>
        <LanguageSelector selectLanguage={handleLanguageSelect}/>
      </label>
      <div>
      <button>Submit</button>
      </div>
    </form>
    </>
  )
}

export default SubmitDraft;
