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

  const handleClickAdd = () => {
    if (selected.length === 0) return

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
    const punctuationRegex = /[!"#$%&'()*1+-./:;<=>?@[\]^_`{|}~﹒。“”‘’「」『』、·《》〈〉…！？（）]/
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

  const keyPressHandle = ({ key }) => {
    switch (key) {
      case "1":
        handleClickAdd()
        break;
      case "2":
        handleClickDiscard()
        break;
      case "3":
        handleClickUndo()
        break;
      case "4":
        handleClickNextPunct()
        break;
      default:
        return

    }
  }

  useEventListener("keydown", keyPressHandle)

  return (
    <>
    <button type="button" onClick={handleClickAdd}>Add Selection</button>
    <button type="button" onClick={handleClickAddBlank}>Add blank</button>
    <button type="button" onClick={handleClickUndo}>Undo</button>
    <button type="button" onClick={handleClickNextPunct}>Next sentence</button>
    </>
  )
}

export default ButtonEdit;
