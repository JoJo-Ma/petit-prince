import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

import useModal from '../Util/useModal'




const ModalTranslation = ({buttonText, children}) => {
  const modalRef = useModal(null)

  const openModal = (modal) => {
    modal.current.style.display = "block"
  }
  const closeModal = (modal) => {
    if(!modal) return
    modal.current.style.display = "none"
  }
  const childrenWithProps = React.Children.map(children, child => {
  // Checking isValidElement is the safe way and avoids a typescript
  // error too.
  if (React.isValidElement(child)) {
    return React.cloneElement(child, { closeModal, modalRef });
  }
  return child;
});
  return (
    <>
    <button type="button" onClick={() => openModal(modalRef)}>{buttonText}</button>
    <div ref={modalRef} className="load-modal modal-new-translation">
      <div className="modal-new-translation-icon" ><FontAwesomeIcon icon={faClose} className="icon" onClick={() => closeModal(modalRef)}/></div>
      <div className="modal-new-translation-content">

          <div className="modal-new-translation-buttons">
            {childrenWithProps}
          </div>

      </div>
    </div>
    </>
  )
}

export default ModalTranslation;
