import React from 'react'
import DashboardChangePwd from './DashboardChangePwd'
import DashboardVerifyEmail from './DashboardVerifyEmail'

import {
    Routes,
    Route,
    Link
  } from "react-router-dom";

const DashboardSettings = ({setAuth, setName, setLoggedIn={setLoggedIn}, name={name}}) => {
    return (
        <div className='settings-viewport'>
            <div className='settings-navbar'>
                <Link className="navbar-el settings-navbar-el" to="changepwd">Change password</Link>
                {/* <Link className="navbar-el settings-navbar-el" to="verify">Verify email</Link> */}
            </div>
            <div className='settings-child'>
                <Routes>
                    <Route path="changepwd" element={<DashboardChangePwd setAuth={setAuth} setName={setName} setLoggedIn={setLoggedIn} name={name} />} />
                    {/* <Route path="verify" element={<DashboardVerifyEmail setAuth={setAuth} setName={setName} setLoggedIn={setLoggedIn} name={name} />} /> */}
                </Routes>
            </div>
        </div>
    )
}

export default DashboardSettings;
