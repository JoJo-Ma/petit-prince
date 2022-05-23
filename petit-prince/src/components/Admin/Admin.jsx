import React from 'react';
import Navbar from '../Navbar/Navbar'
import AdminNavbar from './AdminNavbar'
import AdminLanguages from './AdminLanguages'


import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";


const Admin = () => {

  return (
    <>
      <Navbar />
      <AdminNavbar />

      <Routes>
        <Route path="languages" element={<AdminLanguages />} />
      </Routes>
    </>
  )
}

export default Admin;
