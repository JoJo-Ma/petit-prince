import './App.css';
import React, { useState, useEffect } from 'react';
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Dashboard from './components/Dashboard/Dashboard'
import NewTranslation from './components/NewTranslation/NewTranslation'
import Translation from './components/Translation/Translation'
import Record from './components/Record/Record'


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const setAuth = (boolean) => {
    setIsLoggedIn(boolean)
  }

  const isAuth = async () => {
    try {
      const response = await fetch("http://localhost:3005/auth/isverified", {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()

      parseRes === true ? setIsLoggedIn(true) : setIsLoggedIn(false)
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    isAuth()
  })

  return (
    <div className="App">
      <Router>
        <div className="container">
          <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={ !isLoggedIn ? <Login setAuth={setAuth}/> : <Navigate to="/dashboard" />}/>
          <Route path="/register" element={ !isLoggedIn ? <Register setAuth={setAuth} /> : <Navigate to="/login" />}/>
          <Route path="/dashboard" element={ isLoggedIn ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />}/>
          <Route path="/newtranslation" element={ isLoggedIn ? <NewTranslation setAuth={setAuth} /> : <Navigate to="/login" />}/>
          <Route path="/translation" element={ isLoggedIn ? <Translation setAuth={setAuth} /> : <Navigate to="/login" />} />
          <Route path="/record" element={ isLoggedIn ? <Record setAuth={setAuth} /> : <Navigate to="/login" />} />

          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
