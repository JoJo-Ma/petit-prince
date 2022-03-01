import React, { useState, useEffect } from 'react';

export default ({setInputURL, urlInput, handleClickPdf}) => {

  const [ input, setInput ] = useState("")

  const onChangeURL = (e) => {
    setInputURL(e.target.value)
  }

  const handleClick =  async (e) => {
    e.preventDefault()
    handleClickPdf('Loading...')
    try {
      const body = { url: urlInput }
      const response = await fetch("http://localhost:3005/pdfparser", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(body)
      } )

      const parseRes = await response.text()

      handleClickPdf(parseRes.replace(/\s{2,}/g, ' ').trim())
    } catch (error) {
      handleClickPdf(error.message)
      console.error(error.message);
      return
    }
  }

  return (
    <>
      <input type="text" name="url" placeholder="URL" onChange={e => onChangeURL(e)}/>
      <button type="button" onClick={handleClick}>Submit</button>
    </>
  )
}
