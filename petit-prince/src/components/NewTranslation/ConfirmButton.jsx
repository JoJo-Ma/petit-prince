import React, { useState, useEffect } from 'react';

const ConfirmButton = ({disabled, onClick, initialLabel, onConfirmLabel}) => {

  const [isTriggered, setIsTriggered] = useState(false)

  const triggerConfirm = () => {
    setIsTriggered(true)
  }

  const action = () => {
    onClick()
    setIsTriggered(false)
  }

  useEffect(() => {
    if(!isTriggered) return
    const timer = setTimeout(() => setIsTriggered(false),2000)
    return () => clearTimeout(timer)
  }, [isTriggered])

  return (
    <>
      {
        isTriggered
        ?
        <button onClick={action} disabled={disabled}>{onConfirmLabel}</button>
        :
        <button onClick={triggerConfirm} disabled={disabled}>{initialLabel}</button>
      }
    </>
  )
}

export default ConfirmButton;
