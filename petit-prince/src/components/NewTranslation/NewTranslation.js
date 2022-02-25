// will handle importing pdfs to temporary state, then trimming, breaking down into
// individual strings and saving to db

import React, { useState, useEffect, useRef, useReducer} from 'react';
import {initialState, reducer} from './reducerTranslation'

import Navbar from '../Navbar/Navbar'
import NewTranslationResult from './NewTranslationResult'
import NewTranslationDraft from './NewTranslationDraft'
import SubmitDraft from './SubmitDraft'
import LoadDraft from './LoadDraft'

import "./NewTranslation.css"

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


const NewTranslation = () => {

  const [state, dispatch] = useReducer(reducer, initialState)

  const onChangeURL = (e) => {
    dispatch({type:'setUrlInput', payload: e.target.value})
  }

  const handleClickPdf =  async (e) => {
    e.preventDefault()
    dispatch({type:'reset'})
    dispatch({type:'setOutput', payload: "Loading..."})
    try {
      const body = { url: state.urlInput }

      const response = await fetch("http://localhost:3005/pdfparser", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(body)
      } )

      const parseRes = await response.text()

      dispatch({type:'setOutput', payload: parseRes.replace(/\s{2,}/g, ' ').trim()})
      // setOutput(parseRes.replace(/\s{2,}/g, ' ').trim())
    } catch (error) {
      dispatch({type:'setOutput', payload: error.message})
      console.error(error.message);
      return
    }
  }

  // retrieves selected text from the imported pdf text along with useEffect right below
  const handleSelection = () => {
    const text = document.getSelection().toString()
    const selection = {
      text: text,
      length: text.length

    }
    if (text === state.output.slice(0, selection.length)) {
      dispatch({type:'setSelected', payload:selection})
    }
  }
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
    };
  })

  const handleClickAdd = () => {
    if (state.selected.length === 0) {
      return
    }
    dispatch({type:'add'})
  }

  const handleClickAddBlank = () => {
    dispatch({type:'addBlank'})
  }

  const handleClickUndo = () => {
    if (state.newTranslationListId === 0) return
    dispatch({type:"undo", payload:state.lastAction[state.lastAction.length - 1]})
  }

  //discards selected area (useless test, unwanted characters, etc)
  const handleClickDiscard = () => {
    if (state.selected.length === 0) {
      return
    }
    dispatch({type:"discard"})
  }

  const handleClickNextPunct = () => {
    //regex to find next the punctuation character in text, support for other languages to be added when needed
    const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~﹒。“”‘’「」『』、·《》〈〉…！？（）]/
    if (state.selected.length > 0) {
      const offsetIndex = punctuationRegex.exec(state.output.slice(state.selected.length)).index
      dispatch({type:"setSelected", payload:{
        text: state.selected.text + state.output.slice(state.selected.length,state.selected.length + offsetIndex + 1),
        length: state.selected.length + offsetIndex + 1
      }})
      return
    }
    dispatch({type:"setSelected", payload:{
      text:state.output.slice(0,punctuationRegex.exec(state.output).index + 1),
      length:punctuationRegex.exec(state.output).index + 1
    }})
  }

  const handleClickSaveJson = () => {
    const json = state
    const blob = new Blob([JSON.stringify(json, null, 2)], {type : 'application/json'})
    const toSave = document.createElement('a');
    toSave.download = "save.json"
    toSave.href = URL.createObjectURL(blob)
    toSave.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(toSave.href), 30 * 1000)
    })
    toSave.click()

  }

  const loadData = (data) => {
    dispatch({ type:"load", payload:data})
  }

  useEffect(() => {
    document.getElementById('file-selector').addEventListener('change', (e) => {
      try {
        const file = e.target.files[0];
        if(file.type !== "application/json") {
          console.log("incorrect file format");
          return
        }
        const readFile = new FileReader();
        readFile.onload = (e) => {
          const data = e.target.result
          const json = JSON.parse(data)
          console.log(json.urlInput);
          loadData(json)
        }
        readFile.readAsText(file)
        document.getElementById('file-selector').value = ""
      } catch (error) {
        console.log(error.message);
      }
    })
  }, [])

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
      <Navbar />
      <div>
        <h1>New Translation</h1>
        <div className="result">
          <input type="text" name="url" placeholder="URL" onChange={e => onChangeURL(e)}/>
          <button type="button" onClick={handleClickPdf}>Submit</button>
          <button type="button" onClick={handleClickAdd}>Add Selection</button>
          <button type="button" onClick={handleClickAddBlank}>Add blank</button>
          <button type="button" onClick={handleClickUndo}>Undo</button>
          <button type="button" onClick={handleClickNextPunct}>Next sentence</button>
          <button type="button" onClick={handleClickSaveJson}>Save file</button>
          <p>Load file</p>
          <input type="file" id="file-selector" accept=".json" />
        </div>
      </div>
      <SubmitDraft data={state}/>
      <LoadDraft loadData={loadData} />
      <div className="preview-selected">{state.selected.text}</div>
      <div className="text-container">
        <NewTranslationResult data={state.output} />
        <NewTranslationDraft data={state.newTranslationList} />
      </div>
    </>
  )

}

export default NewTranslation;
