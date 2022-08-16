import React from 'react';
import { baseUrl } from '../../Util/apiUrl';

const OpenCloseIssue = ({id, status, triggerReloadClick}) => {

  const handleClick = async () => {
    try {
      const statusApiRequest = status == "OPEN" ? "CLOSED" : "OPEN"
      const response = await fetch(`${baseUrl}/issuelog/${id}/${statusApiRequest}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
        token : localStorage.token }
      })
      triggerReloadClick()

    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
    { status == "OPEN" ?
      <button className="" onClick={() => handleClick()}>Close Issue</button>
      :
      <button className="" onClick={() => handleClick()}>Reopen Issue</button>
    }
    </>
  )
}

export default OpenCloseIssue;
