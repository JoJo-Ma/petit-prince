import React from 'react';


const ButtonRecorder = ({className, onClick, children, disabled, alt}) => {
  return (
    <div className={className} onClick={!disabled ? onClick : undefined} alt={alt} >
      {children}
    </div>
  )
}

export default ButtonRecorder;
