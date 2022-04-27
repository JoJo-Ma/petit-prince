import React from 'react';


const SvgButton = ({className, onClick, children, disabled, alt, button}) => {

  return (
    <div className={className} onClick={!disabled ? onClick : undefined} alt={alt} >
      {button ? button : children}
      <span className="tooltip">{alt}</span>
    </div>
  )
}

export default SvgButton;
