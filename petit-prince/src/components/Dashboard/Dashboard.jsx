import React, { useEffect } from 'react';
import Navbar from '../Navbar/Navbar'
import ListOfDrafts from './ListOfDrafts'
import ListOfRecordings from './ListOfRecordings'


import { useStoreActions, useStoreState } from 'easy-peasy'




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
      <h1>Dashboard</h1>
      <h2>Hello {name}</h2>
      <ListOfDrafts username={name} />
      <ListOfRecordings />
      <button onClick={e => logout(e)}>Log out</button>
    </>
  )
}

export default Dashboard
