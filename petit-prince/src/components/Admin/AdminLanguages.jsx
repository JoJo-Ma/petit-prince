import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar'
import AdminNavbar from './AdminNavbar'

import useFetchLanguages from '../LanguageSelector/useFetchLanguages'


const AdminLanguages = () => {

  const { languages } = useFetchLanguages()
  const [ newLanguage, setNewLanguage] = useState("")


  const onChange = (e) => {
    setNewLanguage(e.target.value)
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const body = { newLanguage }
      console.log(body);
      const response = await fetch("http://localhost:3005/languages/", {
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
    <h1>Languages</h1>
    <div>
      {
        languages.map((language,index) => {
          return <p key={index}>{language.name}</p>
        }
      )}
    </div>
    <div className="admin-navbar-form">
      <form onSubmit={onSubmitForm}>
        <div className="form__group">
          <input className="form__field" type="text" value={newLanguage} name="name" style={{width:"100%"}} onChange={e => onChange(e)} placeholder="Draft name" />
          <label for="name"  className="form__label">Add language</label>
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </div>
    </>
  )
}

export default AdminLanguages;
