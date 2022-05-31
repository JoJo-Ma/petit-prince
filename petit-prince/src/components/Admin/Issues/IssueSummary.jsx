import React from 'react';

const IssueSummary = ({status,
  req_name,
  created_on,
  modified_on,
  type,
  subtype,
  comment,
  sentence_id,
  sentence,
  language
}) => {
  return (
    <div className="issue-container">
        <div className="issue-header">
          <p>Raised by <b>{req_name}</b></p>
          <p>Created on <b>{new Date(created_on).toLocaleDateString("en-UK")}</b></p>
          <p>Last modified on <b>{new Date(modified_on).toLocaleDateString("en-UK")}</b></p>
          <p> Status: <b style={status==="OPEN" ?
          {color:"#a1f93a"} :
          {color:"red"}
        }>{status}</b></p>
        </div>
        <div className="issue-details">
        <p>Type : <b>{type}</b></p>
        {type!=="OTHER" && <p>Reason : <b>{subtype}</b></p>}
        <p>Comment : <b>{comment}</b></p>
        </div>
        <div className="issue-reported">
        <p>Language: <b>{language}</b></p>
        <p>Sentence with ID <b>{sentence_id}</b> :</p>
        <p>{sentence}</p>

        </div>
    </div>
  )
}

export default IssueSummary;
