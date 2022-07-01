import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useStoreState } from 'easy-peasy';
import useFetchAdmin from '../Util/useFetchAdmin'

import './Navbar.css'

const Navbar = () => {
  const name = useStoreState(state => state.naming.name)
  const loggedIn = useStoreState(state => state.login.loggedIn)
  const { adminStatus } = useFetchAdmin([])


  return (
    <ul className="navbar-container">
      <div className="navbar-logo">
        <li className="li-logo"></li>
      </div>
      <div className="navbar-elements">
        {
          loggedIn ?
          (
            <>
            <li>
              <p className="navbar-el-caption">Welcome, {name}!</p>
            </li>
            <li>
              <Link className="navbar-el" to="/">Home</Link>
            </li>
            <li>
              <Link className="navbar-el" to="/translation">Translation</Link>
            </li>
            <li>
              <Link className="navbar-el" to="/record">Record</Link>
            </li>
            <li>
              <Link className="navbar-el" to="/newtranslation">New Translation</Link>
            </li>
            <li>
              <Link className="navbar-el" to="/dashboard">Dashboard</Link>
            </li>
            </>

        )
        :
        (
          <>
          <li>
            <Link className="navbar-el" to="/">Home</Link>
          </li>
          <li>
            <Link className="navbar-el" to="/login">Log in</Link>
          </li>
          <li>
            <Link className="navbar-el" to="/register">Sign up</Link>
          </li>
          <li>
            <p className="navbar-el-caption">Please sign up or log in!</p>
          </li>
          </>

      )

    }
    {
      adminStatus > 0 &&
        <li>
          <Link className="navbar-el" to="/admin">Admin</Link>
        </li>
    }
      </div>
    </ul>
  )
}

export default Navbar;
