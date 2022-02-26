// will handle importing pdfs to temporary state, then trimming, breaking down into
// individual strings and saving to db

import React, { useState, useEffect, useRef, useReducer} from 'react';
import {initialState, reducer} from './reducerTranslation'

import Navbar from '../Navbar/Navbar'
import NewTranslationResult from './NewTranslationResult'
import NewTranslationDraft from './NewTranslationDraft'
import SubmitDraft from './SubmitDraft'
import LoadDraft from './LoadDraft'

import ButtonSaveDraftFile from './Buttons/ButtonSaveDraftFile'
import ButtonLoadDraftFile from './Buttons/ButtonLoadDraftFile'
import ButtonLoadPdf from './Buttons/ButtonLoadPdf'

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

  const setInputURL = (data) => {
    dispatch({type:'setUrlInput', payload: data})
  }

  const handleClickPdf = (data) => {
    dispatch({type:'reset'})
    dispatch({type:'setOutput', payload: "Loading..."})
    dispatch({type:'setOutput', payload: data})
  }

  // retrieves selected text from the imported pdf text along with useEffect right below
  const handleSelection = (selection) => {
    dispatch({type:'setSelected', payload:selection})
  }

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

  const loadData = (data) => {
    dispatch({ type:"load", payload:data})
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
      <Navbar />
      <div>
        <h1>New Translation</h1>
        <div className="result">
          <ButtonLoadPdf setInputURL={setInputURL} handleClickPdf={handleClickPdf} urlInput={state.urlInput} />
          <button type="button" onClick={handleClickAdd}>Add Selection</button>
          <button type="button" onClick={handleClickAddBlank}>Add blank</button>
          <button type="button" onClick={handleClickUndo}>Undo</button>
          <button type="button" onClick={handleClickNextPunct}>Next sentence</button>
          <ButtonSaveDraftFile data={state} />
          <ButtonLoadDraftFile loadData={ loadData } />
        </div>
      </div>
      <SubmitDraft data={state}/>
      <LoadDraft loadData={ loadData } />
      <div className="preview-selected">{state.selected.text}</div>
      <div className="text-container">
        <NewTranslationResult data={state.output} selection = { state.selection }  handleSelection = { handleSelection }/>
        <NewTranslationDraft data={state.newTranslationList} />
      </div>
    </>
  )

}

export default NewTranslation;
