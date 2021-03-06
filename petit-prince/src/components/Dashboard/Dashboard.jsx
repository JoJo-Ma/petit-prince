import React, { useEffect } from 'react';
import Navbar from '../Navbar/Navbar'

import DashboardNavbar from './DashboardNavbar'
import DashboardSummary from './DashboardSummary'
import DashboardNotifications from './DashboardNotifications'

import DashboardSettings from './DashboardSettings'
import useFetchNotifications from '../Util/useFetchNotifications'

import { useStoreActions, useStoreState } from 'easy-peasy'

import {
  Routes,
  Route,
} from "react-router-dom";

import './Dashboard.css'

const Dashboard = ({ setAuth}) => {

  const name = useStoreState((state) => state.naming.name)
  const setName = useStoreActions((actions) => actions.naming.setName)
  const loggedIn = useStoreState((state) => state.login.loggedIn)
  const setLoggedIn = useStoreActions((actions) => actions.login.setLoggedIn)

  const { notifications, triggerReloadNotifications } = useFetchNotifications(name)


  return (
    <>
      <Navbar />
      <DashboardNavbar name={name} notifications={notifications} />

        <Routes>
          <Route path="" element={<DashboardSummary setAuth={setAuth} setName={setName} setLoggedIn={setLoggedIn} name={name} />} />
          <Route path="settings/*" element={<DashboardSettings setAuth={setAuth} setName={setName} setLoggedIn={setLoggedIn} name={name} />} />
          <Route path="notifications" element={<DashboardNotifications name={name} notifications={notifications} triggerReloadNotifications={triggerReloadNotifications} />} />
        </Routes>

    </>
  )
}

export default Dashboard
