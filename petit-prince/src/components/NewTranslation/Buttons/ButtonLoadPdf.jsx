import React from 'react';

const ButtonLoadPdf = ({setInputURL, urlInput, handleClickPdf}) => {

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
    <div className="load-container">
      <input type="text" name="url" className="form__field" placeholder="URL" onChange={e => onChangeURL(e)}/>
      <button type="button" onClick={handleClick}>Submit</button>
    </div>
  )
}

export default ButtonLoadPdf;
