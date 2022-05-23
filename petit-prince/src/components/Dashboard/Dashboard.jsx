import React, { useEffect } from 'react';
import Navbar from '../Navbar/Navbar'
import ListOfDrafts from './ListOfDrafts'
import ListOfRecordings from './ListOfRecordings'


import { useStoreActions, useStoreState } from 'easy-peasy'


import './Dashboard.css'

const Dashboard = ({ setAuth}) => {

  const name = useStoreState((state) => state.naming.name)
  const setName = useStoreActions((actions) => actions.naming.setName)
  const loggedIn = useStoreState((state) => state.login.loggedIn)
  const setLoggedIn = useStoreActions((actions) => actions.login.setLoggedIn)




  const logout = (e) => {
    e.preventDefault()
    localStorage.removeItem("token")
    setName(null)
    setLoggedIn(false)
    setAuth(false)
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>Dashboard</h1>
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
    </>
  )
}

export default Dashboard
