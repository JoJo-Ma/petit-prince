import React from 'react';
import { baseUrl } from '../../Util/apiUrl';

const ButtonLoadPdf = ({setInputURL, urlInput, handleClickPdf}) => {

  const onChangeURL = (e) => {
    setInputURL(e.target.value)
  }

  const handleClick =  async (e) => {
    e.preventDefault()
    handleClickPdf('Loading...')
    try {
      const body = { url: urlInput }
      const response = await fetch(`${baseUrl}/pdfparser`, {
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
    <div className="load-container">
      <div className="form__group">
        <input type="text" name="url" className="form__field" placeholder="URL" onChange={e => onChangeURL(e)}/>
        <label for="url"  className="form__label">PDF's URL</label>
      </div>
      <button type="button" onClick={handleClick}>Submit</button>
    </div>
  )
}

export default ButtonLoadPdf;
