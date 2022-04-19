import React from 'react';
import Select from 'react-select';


const RecordingSelector = ({language, usernames, selectUsername}) => {



  const handleChange = (e) => {
    selectUsername(e.value)
  }

  const options = usernames.map((username) => { return {
      value: username.username, label: username.username
    }})

  return (
    <div className="recording-selector">
      <Select
        className="recording-react-select-container"
        classNamePrefix="recording-react-select"
        onChange={(e) => handleChange(e)}
        options={options}
        placeholder={'Select recording...'}
        theme={(theme) => ({
          ...theme,
          borderRadius:0,
          fontFamily: 'Digital',
          colors: {
            ...theme.colors,
            neutral0: '#d8d2d2',
            primary: '#d8d2d2',
            primary25: '#d8d2d2'
          }
        })}
         />
    </div>
  )
}

export default RecordingSelector;
