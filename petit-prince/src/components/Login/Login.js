import React, { useState } from 'react'
import { Link } from "react-router-dom"
import Navbar from '../Navbar/Navbar'

import './Login.css'


const Login = ({ setAuth }) => {

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  })

  const { password, email } = inputs

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name] : e.target.value})
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const body = { email, password}
      const response = await fetch("http://localhost:3005/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(body)
      })

      const parseRes = await response.json()

      localStorage.setItem('token', parseRes.token)

      setAuth(true);


    } catch (error) {
      console.error(error.message);
    }
  }

  return(
    <>
    <Navbar />
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={onSubmitForm}>
        <label>
          <p>Email</p>
          <input type="text" value={email} name="email" onChange={e => onChange(e)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" value={password} name="password" onChange={e => onChange(e)} />
        </label>
        <div>
          <button>Submit</button>
        </div>
      </form>
      <Link to="/register">Register</Link>
    </div>
    </>
  )
}

export default Login;
