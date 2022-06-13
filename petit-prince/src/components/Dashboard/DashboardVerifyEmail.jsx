import React, { useState } from 'react'
import useAlert from '../Util/useAlert'


const DashboardVerifyEmail = () => {
    const [code, setCode] = useState()
    const [isCodeSent, setIsCodeSent] = useState(false)
    const { alert, setAlert } = useAlert(3000)

    const onCodeChange = (e) => {
        setCode(e.target.value)
    }

    const onSubmitForm = (e) => {
        e.preventDefault()
    }

    const onButtonClick = (e) => {
        setIsCodeSent(true)
    }

    return (
    <>
        <p>Verify your email address by clicking the button below :</p>
        <button onClick={onButtonClick}>Send email</button>
        {
            isCodeSent &&
            <>
                <p>Enter the code sent to your email address :</p>
                <form onSubmit={onSubmitForm}>
                <div className="form__group">
                <input className="form__field" type="text" value={code} name="code" onChange={e => onCodeChange(e)} placeholder="Code" />
                <label for="code" className="form__label">Current password</label>
                </div>
                <div>
                <button>Submit</button>
                </div>
                { alert &&
                <p>{alert}</p>
                }
                </form>
            </>
        }
    </>)
}

export default DashboardVerifyEmail;