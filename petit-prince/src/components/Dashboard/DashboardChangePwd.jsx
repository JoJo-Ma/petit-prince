import React, { useState } from 'react';
import useAlert from '../Util/useAlert'

const DashboardChangePwd = ({setAuth}) => {

  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confPwd, setConfPwd] = useState('')
  const { alert, setAlert } = useAlert(3000)

  const onCurrPwdChange = (e) => {
    setCurrentPwd(e.target.value)
  }
  const onNewPwdChange = (e) => {
    setNewPwd(e.target.value)
  }
  const onConfPwdChange = (e) => {
    setConfPwd(e.target.value)
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    if (newPwd === currentPwd) {
      setAlert("The old password and the new one cannot be the same.")
      return
    }
    if (newPwd !== confPwd) {
      setAlert("The passwords do not match.")
      return
    }
    if (newPwd.length < 8) {
      setAlert("The password must be at least 8 characters.")
      return
    }
    try {
      const body = { newPwd, currentPwd}
      const response = await fetch(`http://localhost:3005/auth/updatepwd`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
        token : localStorage.token },
        body: JSON.stringify(body)
      })
      if (response.status === 403) {
        throw "Error"
      }
      const parseRes = await response.json()
      if (parseRes.updated === false) {
        setAlert("Invalid password.")
        return
      }
      localStorage.setItem('token', parseRes.token)
      setAuth(true);
      setAlert("Password updated!")
    } catch (error) {
      setAlert("Error, please try again later.")
    }
  }


  return (
    <div className="changepwd-wrapper">
      <h1>Change password</h1>
      <form onSubmit={onSubmitForm}>
        <div className="form__group">
          <input className="form__field" type="password" value={currentPwd} name="currentpwd" onChange={e => onCurrPwdChange(e)} placeholder="Current password" />
          <label for="currentpwd" className="form__label">Current password</label>
        </div>
        <div className="form__group">
          <input className="form__field" type="password" value={newPwd} name="password" onChange={e => onNewPwdChange(e)} placeholder="Password" />
          <label for="password" className="form__label">New password</label>
        </div>
        <div className="form__group">
          <input className="form__field" type="password" value={confPwd} name="password" onChange={e => onConfPwdChange(e)} placeholder="Password" />
          <label for="password" className="form__label">Confirm password</label>
        </div>
        <div>
          <button>Submit</button>
        </div>
        { alert &&
          <p>{alert}</p>
        }
      </form>
    </div>
  )
}

export default DashboardChangePwd;
