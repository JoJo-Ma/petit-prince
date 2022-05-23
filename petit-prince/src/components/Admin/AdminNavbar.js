import React from 'react';
import { Link } from "react-router-dom";

import './Admin.css'

const AdminNavbar = () => {



  return (
    <ul className="navbar-container admin-navbar">
      <div className="navbar-elements">
            <>
            <li>
              <Link className="navbar-el" to="languages">Languages</Link>
            </li>
            </>
      </div>
    </ul>
  )
}

export default AdminNavbar
