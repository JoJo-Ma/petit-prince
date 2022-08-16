import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'
import { baseUrl } from '../Util/apiUrl';
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
      const response = await fetch(`${baseUrl}/auth/register`, {
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
      <div className="login-wrapper">
        <h1>Register</h1>
        <form onSubmit={onSubmitForm}>
          <div className="form__group">
            <input
              className="form__field"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={e => onChange(e)}
              />
            <label for="email" className="form__label" >Email</label>
          </div>
          <div className="form__group">
            <input
              className="form__field"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={e => onChange(e)}
              />
            <label for="password" className="form__label" >Password</label>
          </div>
          <div className="form__group">
            <input
              className="form__field"
              type="text"
              name="username"
              placeholder="Name"
              value={username}
              onChange={e => onChange(e)}
              />
            <label for="username" className="form__label" >Name</label>
          </div>
          <button>Submit</button>
        </form>
        <Link to="/login">Login</Link>
      </div>
    </>
  )
}

export default Register;
