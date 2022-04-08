import React from 'react';

const ButtonSaveDraftFile = ({data}) => {

  const handleClickSaveJson = () => {
    const json = data
    const blob = new Blob([JSON.stringify(json, null, 2)], {type : 'application/json'})
    const toSave = document.createElement('a');
    toSave.download = "save.json"
    toSave.href = URL.createObjectURL(blob)
    toSave.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(toSave.href), 30 * 1000)
    })
    toSave.click()

  }


  return (
    <button type="button" onClick={handleClickSaveJson}>Save file</button>
  )
}

export default ButtonSaveDraftFile;
