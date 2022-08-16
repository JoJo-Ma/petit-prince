import React, { useState } from 'react'
import { Link } from "react-router-dom"
import Navbar from '../Navbar/Navbar'
import { useStoreActions, useStoreState } from 'easy-peasy'
import './Login.css'
import { useLocation } from "react-router-dom";
import { baseUrl } from '../Util/apiUrl'

const Login = ({ setAuth }) => {

  const setLoggedIn = useStoreActions((actions) => actions.login.setLoggedIn)
  const location = useLocation();


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
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(body)
      })

      const parseRes = await response.json()
      console.log(parseRes);
      localStorage.setItem('token', parseRes.token)

      setAuth(true);
      setLoggedIn(true)
      checkVerifiedEmail(parseRes.is_verified, parseRes.username)
    } catch (error) {
      console.error(error.message);
    }
  }

  const checkVerifiedEmail = async (isVerified, username) => {
    if(isVerified) return
    try {
      const body = {
        type:"ALERT",
        subtype:"Unverified email adress",
        message: "Your email adress is not verified. Consider doing it to receive updates!",
        username: username,
        id: 0
      }
      console.log(JSON.stringify(body));
      const response = await fetch(`${baseUrl}/notifications/`,{
        method: "POST",
        headers:{
        "Content-Type": "application/json",
        token : localStorage.token
        },
        body: JSON.stringify(body)
      })
      console.log(response);
      const parseRes = await response.json()
      console.log(parseRes)
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
        <div className="form__group">
          <input className="form__field" type="text" value={email} name="email" onChange={e => onChange(e)} placeholder="Email" />
          <label for="email" className="form__label">Email</label>
        </div>
        <div className="form__group">
          <input className="form__field" type="password" value={password} name="password" onChange={e => onChange(e)} placeholder="Password" />
          <label for="password" className="form__label">Password</label>
        </div>
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
