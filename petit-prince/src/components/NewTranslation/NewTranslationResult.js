import React, { useEffect } from 'react';
import "./NewTranslation.css"


const NewTranslationResult = ({data, selection, handleSelection}) => {

  // retrieves selected text from the imported pdf text along with useEffect right below
  const highlightSelection = () => {
    const text = document.getSelection().toString()
    const selection = {
      text: text,
      length: text.length

    }
    if (text === data.slice(0, selection.length)) {
      handleSelection(selection)
    }
  }
  useEffect(() => {
    document.addEventListener('selectionchange', highlightSelection);
    return () => {
      document.removeEventListener('selectionchange', highlightSelection);
    };
  })


  return (
    <div className="pdf-to-text loaded-pdf">{data}</div>
  )
}

export default NewTranslationResult;
