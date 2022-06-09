import React, { useState, useEffect } from 'react';

const TextIssue = ({ sentenceId,
          transDescId,
          language,
          sentence,
          type,
          subtype,
          id}) => {

  const [newSentence, setNewSentence] = useState(sentence)

  useEffect(() => {
    setNewSentence(sentence)

  }, [sentence])

  const onSentenceChange = (e) => {
    setNewSentence(e.target.value)
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const body= {newSentence:newSentence}
      const response = await fetch(`http://localhost:3005/translations/${transDescId}/${sentenceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
        token : localStorage.token },
        body: JSON.stringify(body)
      })
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <form onSubmit={onSubmitForm} className="input-form">
      <div className="form__group">
        <input className="form__field" type="text" value={newSentence} name="sentence" style={{width:"100%"}} onChange={e => onSentenceChange(e)} placeholder="New sentence" />
        <label for="sentence"  className="form__label">New sentence</label>
      </div>
      <div>
        <button>Update sentence</button>
      </div>
    </form>
  )
}

export default TextIssue;
