import React from 'react';

const RecordingSelector = ({language, usernames, selectUsername}) => {



  const handleChange = (e) => {
    selectUsername(e.target.value)
  }

  return (
    <>
      <p>choose available recording for {language}</p>
      <select onChange={(e) => handleChange(e)}>
        <option value="" defaultValue hidden>Choose here</option>
        {usernames.map((username, index) => {
          return <option key={index} value={username.username}>{username.username}</option>
        })}
      </select>
    </>
  )
}

export default RecordingSelector;
