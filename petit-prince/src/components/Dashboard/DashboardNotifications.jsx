import React from 'react';
import { Link } from "react-router-dom";
import { baseUrl } from '../Util/apiUrl';
import useFetchNotifications from '../Util/useFetchNotifications'

import './Dashboard.css'


const DashboardNotifications = ({name, notifications, triggerReloadNotifications}) => {


  const viewItem = async (e, id, viewed) => {
    if (viewed) return
    console.log(id);
    console.log(viewed);
    try {
      const response = await fetch(`${baseUrl}/notifications/${name}/${id}`, {
        method: "PUT",
        headers: {token : localStorage.token}
      })
      triggerReloadNotifications()
    } catch (error) {
      console.error(error.message);
    }
  }

  const removeItem = async (e, id) => {
    try {
      const response = await fetch(`${baseUrl}/notifications/display/${name}/${id}`, {
        method: "PUT",
        headers: {token : localStorage.token}
      })
      triggerReloadNotifications()
    } catch (error) {
      console.error(error.message);
    }

  }

  return (
    <ul className="">
      {
         notifications && notifications.filter(notification => notification.display === true).length > 0 ?
          <table className="dashboard-notifications-table">

            {
              notifications.filter(notification => notification.display === true).map((notification, index)=> {
                const {id, created_on, type, subtype, message, viewed} = notification
                return  <tr key={index} className={viewed ?
                     "dashboard-notifications-item dashboard-notifications-seen"
                     :
                     "dashboard-notifications-item dashboard-notifications-unseen"
                } onMouseEnter={(e) => viewItem(e, id, viewed)}>
                  <td>{subtype}</td>
                  <td>{message}</td>
                  <td onClick={(e) => removeItem(e, id)}>Discard</td>
                </tr>
              })
            }
          </table>
          :
          <p>No notification to display</p>
      }
    </ul>
  )
}

export default DashboardNotifications
