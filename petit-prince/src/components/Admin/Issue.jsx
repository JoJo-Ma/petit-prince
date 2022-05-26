import React, {useState, useEffect} from 'react';
import {useParams, useLocation, Link} from "react-router-dom";

import useFetchIssue from "./useFetchIssue"

const Issue = () => {
  const {id} = useParams();
  const { issueLog:
            {
            req_name,
            created_on,
            status, type,
            subtype, comment,
            ad_name,
            language,
            transtext,
            audiodata
            }
        } = useFetchIssue(id)
  const [sentence, setSentence] = useState('...')
  useEffect(() => {
    if (typeof transtext === "object") {
      setSentence(transtext.newTranslationList.find(el=> el.id == id).text)
    }

  }, [transtext])
  return (
    <>
      {
        req_name ?
        <div className="issue-container">
            <div className="issue-header">
              <p>Raised by <b>{req_name}</b></p>
              <p>Created on <b>{new Date(created_on).toLocaleDateString("en-UK")}</b></p>
            </div>
            <div className="issue-details">
            <p>Type : <b>{type}</b></p>
            {type!=="OTHER" && <p>Reason : <b>{subtype}</b></p>}
            <p>Comment : <b>{comment}</b></p>
            </div>
            <div className="issue-reported">
            <p>Sentence with ID <b>{id}</b> :</p>
            <p>{sentence}</p>
            </div>
        </div>
         :
        <p>odqd</p>
      }
      <Link to="/admin/issuelog" className="issue-log-link">Back</Link>
    </>
  )
}

export default Issue;

// WITH requester_name AS (SELECT id, username FROM users),
// audio_name AS (SELECT id, username FROM users),
// audio AS (SELECT data, sentence_id FROM blobtest WHERE sentence_id = 0 and username_id = '377fce9f-8d26-44eb-9676-ab7d94fa5f10' AND trans_desc_id = 14)
// SELECT issue_log.id, requester_name.username as req_name, created_on, status, type, subtype, comment, issue_log.trans_desc_id, issue_log.sentence_id, audio_name.username as ad_name, language, audio.data as audiodata from issue_log
// INNER JOIN trans_text ON issue_log.trans_desc_id = trans_text.trans_desc_id
// INNER JOIN requester_name ON requester_name.id = issue_log.username_id
// FULL JOIN audio_name ON audio_name.id = issue_log.audio_username_id
// FULL JOIN audio ON audio.sentence_id = issue_log.sentence_id
// WHERE issue_log.id = 21;
