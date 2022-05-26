import React from 'react';
import useFetchIssue from "./useFetchIssue"
import { Link } from "react-router-dom";

import Issue from './Issue'
import './IssueLog.css'

const IssueLogDashboard = () => {
  const {issueLog} = useFetchIssue()

  return (
    <>
      <table className="issue-log-table">
      <tr className="issue-log-item-header">
      <th>Requester</th>
      <th>Created on</th>
      <th>Type</th>
      <th>Subtype</th>
      <th>Comment</th>
      <th>Audio author</th>
      <th>Language</th>
      <th>Status</th>
      <th>Open issue</th>
      </tr>
      {
        issueLog ?
        issueLog.map((issue,index) => {
          const {id, req_name, created_on, status, type, subtype, comment, ad_name, language, sentence_id, trans_desc_id} = issue
          return <tr key={index} className="issue-log-item">
          <td>{req_name}</td>
          <td>{new Date(created_on).toLocaleDateString("en-UK")}</td>
          <td>{type}</td>
          <td style={{textAlign : "left"}}>{subtype}</td>
          <td style={{textAlign : "left"}}>{comment}</td>
          <td>{ad_name}</td>
          <td>{language}</td>
          <td style={status==="OPEN" ?
          {color:"#a1f93a"} :
          {color:"red"}
        }>{status}</td>
        <td><Link to={`${id}`} className="issue-log-link">Go</Link></td>
        </tr>
      })

      :

      <p>no data</p>
    }
    </table>
    </>
  )
}

export default IssueLogDashboard;
