import React from 'react';
import Navbar from '../Navbar/Navbar'
import AdminNavbar from './AdminNavbar'
import AdminLanguages from './AdminLanguages'
import IssueLogDashboard from './IssueLogDashboard'
import Issue from './Issue'

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
        <Route path="issuelog/" element={<IssueLogDashboard />} />
        <Route path="issuelog/:id" element={<Issue />} />
      </Routes>
    </>
  )
}

export default Admin;
