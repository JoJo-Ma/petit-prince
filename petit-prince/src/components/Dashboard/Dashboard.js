import React, { useEffect } from 'react';
import Navbar from '../Navbar/Navbar'
import { useStoreActions, useStoreState } from 'easy-peasy'

const Dashboard = ({ setAuth }) => {

  const name = useStoreState((state) => state.naming.name)
  const setName = useStoreActions((actions) => actions.naming.setName)


  useEffect(() => {
    const getName = async () => {
      try {
        const response = await fetch("http://localhost:3005/dashboard", {
          method: "GET",
          headers: { token: localStorage.token}
        })

        const parseRes = await response.json()

        console.log(parseRes);
        setName(parseRes.username)
      } catch (error) {
        console.error(error.message);
      }
    }
    getName()
  }, [])


  const logout = (e) => {
    e.preventDefault()
    localStorage.removeItem("token")
    setName(null)
    setAuth(false)
  }

  return (
    <>
      <Navbar />
      <h1>Dashboard</h1>
      <h2>Hello {name}</h2>
      <button onClick={e => logout(e)}>Log out</button>
    </>
  )
}

export default Dashboard
