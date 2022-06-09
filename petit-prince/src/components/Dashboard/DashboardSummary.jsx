import React from 'react';
import { Link } from "react-router-dom";
import ListOfDrafts from './ListOfDrafts'
import ListOfRecordings from './ListOfRecordings'



const DashboardSummary = ({ setAuth, setName, setLoggedIn, name}) => {


  const logout = (e) => {
    e.preventDefault()
    localStorage.removeItem("token")
    setName(null)
    setLoggedIn(false)
    setAuth(false)
  }


  return (
    <div className="dashboard-container">
      <h3>Drafts</h3>
      <div className="dashboard-el">
        <ListOfDrafts username={name} />
      </div>
      <h3>Recordings</h3>
      <div className="dashboard-el">
        <ListOfRecordings username={name} />
      </div>
      <button onClick={e => logout(e)}>Log out</button>
    </div>
  )
}

export default DashboardSummary
