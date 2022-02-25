import React from 'react';
import "./NewTranslation.css"


const NewTranslationDraft = ({data}) => {

  return (
    <div className="pdf-to-text no-select" >
    {
      data.map((dataItem) => {
        return (<div key={dataItem.id}>{dataItem.text}</div> )
      })
    }
  </div>
  )
}

export default NewTranslationDraft;
