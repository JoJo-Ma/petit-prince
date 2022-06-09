import React, {useState, useEffect} from 'react';
import {useParams, useLocation, Link} from "react-router-dom";
import AudioIssue from './AudioIssue'
import TextIssue from './TextIssue'
import IssueSummary from './IssueSummary'
import OpenCloseIssue from './OpenCloseIssue'



import useFetchIssue from "./useFetchIssue"

const Issue = () => {
  const {id} = useParams();
  const { issueLog:
            {
            req_name,
            created_on,
            modified_on,
            status, type,
            subtype, comment,
            ad_name,
            language,
            transtext,
            audiodata,
            sentenceId,
            sentence_id,
            trans_desc_id
          },
          triggerReloadClick
        } = useFetchIssue(id)
  const [sentence, setSentence] = useState('...')


  useEffect(() => {
    if (typeof transtext === "object") {
      setSentence(transtext.newTranslationList.find(el=> el.id == sentence_id).text)
    }

  }, [transtext])





  return (
    <>
      {
        req_name &&
        <IssueSummary
            status={status}
            req_name={req_name}
            created_on={created_on}
            modified_on={modified_on}
            type={type}
            subtype={subtype}
            comment={comment}
            sentence_id={sentence_id}
            sentence={sentence}
            language={language}
        />
      }
      { (type == "AUDIO" && status === "OPEN") &&
        <AudioIssue audiodata={audiodata}
        ad_name={ad_name}
        sentence_id={sentence_id}
        trans_desc_id={trans_desc_id}
        language={language}
        sentence={sentence}
        type={type}
        subtype={subtype}
        id={id}
        />
      }
      {
        (type === "TEXT" && status === "OPEN") &&
        <TextIssue
          sentenceId={sentence_id}
          transDescId={trans_desc_id}
          language={language}
          sentence={sentence}
          type={type}
          subtype={subtype}
          id={id}
          triggerReloadClick={triggerReloadClick}
          />
      }
      <OpenCloseIssue status={status} id={id} triggerReloadClick={triggerReloadClick}/>
      <br />
      <Link to="/admin/issuelog" className="issue-log-link">Back</Link>
    </>
  )
}

export default Issue;
