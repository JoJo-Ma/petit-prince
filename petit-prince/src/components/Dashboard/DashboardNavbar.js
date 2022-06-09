import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


const DashboardNavbar = ({ name, notifications }) => {

  const [notificationsAmount, setNotificationsAmount ] = useState(0)

  useEffect(() => {
    if (notifications.length > 0) {
      setNotificationsAmount(notifications.filter(el => el.viewed === false).length)
    }
  }, [notifications])

  return (
    <ul className="navbar-container admin-navbar">
      <div className="navbar-elements">
            <>
            <li>
              <Link className="navbar-el" to="">Dashboard</Link>
              <Link className="navbar-el" to="notifications">{
                  notificationsAmount === 0 ?
                  "Notifications"
                  :
                  `Notifications (${notificationsAmount})`
                  }</Link>
                <Link className="navbar-el" to="changepwd">Change password</Link>
            </li>
            </>
      </div>
    </ul>
  )
}

export default DashboardNavbar
