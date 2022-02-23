import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'

const Register = ({ setAuth }) => {

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    username: ""
  })

  const { email, password, username } = inputs

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name] : e.target.value})
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()

    try {
      const body = { email, password, username }
      const response = await fetch("http://localhost:3005/auth/register", {
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

  return (
    <>
      <Navbar />
      <h1>Register</h1>
      <form onSubmit={onSubmitForm}>
        <input
        type="email"
        name="email"
        placeholder="email"
        value={email}
        onChange={e => onChange(e)}
        />
        <input
        type="password"
        name="password"
        placeholder="password"
        value={password}
        onChange={e => onChange(e)}
        />
        <input
        type="text"
        name="username"
        placeholder="name"
        value={username}
        onChange={e => onChange(e)}
        />
        <button>Submit</button>
      </form>
      <Link to="/login">Login</Link>
    </>
  )
}

export default Register;
