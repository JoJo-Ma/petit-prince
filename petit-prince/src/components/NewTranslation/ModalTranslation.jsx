import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

import useModal from '../Util/useModal'

const openModal = (modal) => {
  modal.current.style.display = "block"
}
const closeModal = (modal) => {
  modal.current.style.display = "none"
}



const ModalTranslation = ({buttonText, children}) => {
  const modalRef = useModal(null)

  return (
    <>
    <button type="button" onClick={() => openModal(modalRef)}>{buttonText}</button>
    <div ref={modalRef} className="load-modal modal-new-translation">
      <div className="modal-new-translation-icon" ><FontAwesomeIcon icon={faClose} className="icon" onClick={() => closeModal(modalRef)}/></div>
      <div className="modal-new-translation-content">
        <div className="modal-new-translation-buttons">
          {children}
        </div>
      </div>
    </div>
    </>
  )
}

export default ModalTranslation;
