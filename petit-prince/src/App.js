import './App.css';
import React, { useState, useEffect } from 'react';
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Dashboard from './components/Dashboard/Dashboard'
import NewTranslation from './components/NewTranslation/NewTranslation'
import Translation from './components/Translation/Translation'
import Record from './components/Record/Record'
import Admin from './components/Admin/Admin'
import { useStoreActions, useStoreState } from 'easy-peasy'
import useFetchAdmin from './components/Util/useFetchAdmin'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet
} from "react-router-dom";
import { baseUrl } from './components/Util/apiUrl';

function PrivateRoute({ isLoggedIn }) {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}


function App() {

  const name = useStoreState((state) => state.naming.name)
  const setName = useStoreActions((actions) => actions.naming.setName)
  const loggedIn = useStoreState((state) => state.login.loggedIn)
  const setLoggedIn = useStoreActions((actions) => actions.login.setLoggedIn)

  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const location = useLocation()
  const { adminStatus } = useFetchAdmin([location])

  const setAuth = (boolean) => {
    setIsLoggedIn(boolean)
  }

  const isAuth = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/isverified`, {
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
    if (!isLoggedIn) return
    const getName = async () => {
      try {
        const response = await fetch(`${baseUrl}/dashboard`, {
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
  }, [isLoggedIn])


  useEffect(() => {
    isAuth()
    if (!isLoggedIn) setLoggedIn(false)
    if (isLoggedIn) setLoggedIn(true)
  }, [location])



  return (
        <div className="App">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/login" element={ !isLoggedIn ? <Login setAuth={setAuth}/> : <Navigate to="/dashboard" />}/>
              <Route path="/register" element={ !isLoggedIn ? <Register setAuth={setAuth} /> : <Navigate to="/login" />}/>
              <Route path="/dashboard/*" element={ isLoggedIn ? <Dashboard  setAuth={setAuth} /> : <Navigate to="/login" />}/>
              <Route path="/admin/*" element={ isLoggedIn && (adminStatus > 0) ? <Admin  setAuth={setAuth} /> : <Navigate to="/login" />}/>
              <Route path='/newtranslation' element={<PrivateRoute isLoggedIn={isLoggedIn}/>}>
                <Route path='/newtranslation' element={<NewTranslation/>}/>
              </Route>
              <Route path="/translation" element={<Translation />} />
              <Route path="/record" element={ isLoggedIn ? <Record /> : <Navigate to="/login" />} />
            </Routes>
        </div>
      </div>
  );
}

export default App;
