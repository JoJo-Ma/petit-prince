import React, { useRef, useEffect } from 'react';

const useEventListener = (eventName, handler, element = window) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};


const ButtonEdit = ({add, addBlank, discard, undo, nextPunct, selected, output }) => {
  const addButtonRef = useRef();
  const addBlankButtonRef = useRef();
  const discardButtonRef = useRef();
  const undoButtonRef = useRef();
  const nextButtonRef = useRef();


  const handleClickAdd = () => {
    if (selected.length === 0) return
    console.log(selected);
    add()
  }

  const handleClickAddBlank = () => {
    addBlank()
  }

  const handleClickDiscard = () => {
    if (selected.length === 0) return
    discard()
  }

  const handleClickUndo = () => {
    undo()
  }

  const handleClickNextPunct = () => {
    //regex to find next the punctuation character in text, support for other languages to be added when needed
    // const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~﹒。“”‘’「」『』、·《》〈〉…！？（）]/
    const punctuationRegex = /[!"#$%&'()*1+-./:;<=>?@[\]^_`{|}~﹒。“”‘’「」『』·《》〈〉…！？（）]/
    if (selected.length > 0) {
      const offsetIndex = punctuationRegex.exec(output.slice(selected.length)).index
      nextPunct({
        text: selected.text + output.slice(selected.length,selected.length + offsetIndex + 1),
        length: selected.length + offsetIndex + 1
      })
      return
    }
    nextPunct({
      text:output.slice(0,punctuationRegex.exec(output).index + 1),
      length:punctuationRegex.exec(output).index + 1
    })

  }

  const simulatePressedKey = (ref) => {
    ref.current.style.transform="scale(1) translateZ(5px) translate3d(0,5px,0)"
    const timer = setTimeout(() => {
        ref.current.style.transform=null
    }, 150);
    return () => clearTimeout(timer);
  }

  const keyPressHandle = ({ key }) => {
    switch (key) {
      case "1":
        handleClickAdd()
        simulatePressedKey(addButtonRef)
        break;
      case "2":
        handleClickDiscard()
        simulatePressedKey(discardButtonRef)
        break;
      case "3":
        handleClickUndo()
        simulatePressedKey(undoButtonRef)
        break;
      case "4":
        handleClickNextPunct()
        simulatePressedKey(nextButtonRef)
        break;
      case "5":
        handleClickAddBlank()
        simulatePressedKey(addBlankButtonRef)
        break;
      default:
        addButtonRef.current.style.transform="none"
        return

    }
  }

  useEventListener("keydown", keyPressHandle)

  return (
    <div className="edit-container">
      <div className="edit-child"><button type="button" ref={addButtonRef} className="edit-button" onClick={handleClickAdd}>1</button>Add Selection</div>
      <div className="edit-child"><button type="button" ref={discardButtonRef} className="edit-button" onClick={handleClickAddBlank}>2</button>Skip selection</div>
      <div className="edit-child"><button type="button" ref={undoButtonRef} className="edit-button" onClick={handleClickUndo}>3</button>Undo</div>
      <div className="edit-child"><button type="button" ref={nextButtonRef} className="edit-button" onClick={handleClickNextPunct}>4</button>Next sentence</div>
      <div className="edit-child"><button type="button" ref={addBlankButtonRef} className="edit-button" onClick={handleClickAddBlank}>5</button>Add blank</div>
    </div>
  )
}

export default ButtonEdit;
