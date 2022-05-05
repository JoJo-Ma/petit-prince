import {useRef, useEffect} from 'react';

const useModal = () => {
  const modalRef = useRef()

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (modalRef.current && modalRef.current === event.target) {
        modalRef.current.style.display = "none"
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  return modalRef

}

export default useModal;
