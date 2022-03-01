// will handle importing pdfs to temporary state, then trimming, breaking down into
// individual strings and saving to db

import React, { useReducer} from 'react';
import {initialState, reducer} from './reducerTranslation'

import Navbar from '../Navbar/Navbar'
import NewTranslationResult from './NewTranslationResult'
import NewTranslationDraft from './NewTranslationDraft'
import SubmitDraft from './SubmitDraft'
import LoadDraft from './LoadDraft'
import LoadTranslation from './LoadTranslation'
import SubmitTranslation from './SubmitTranslation'


import ButtonSaveDraftFile from './Buttons/ButtonSaveDraftFile'
import ButtonLoadDraftFile from './Buttons/ButtonLoadDraftFile'
import ButtonLoadPdf from './Buttons/ButtonLoadPdf'
import ButtonEdit from './Buttons/ButtonEdit'

import "./NewTranslation.css"

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
    dispatch({type:"discard"})
  }

  const handleClickNextPunct = (data) => {
    //regex to find next the punctuation character in text, support for other languages to be added when needed
    dispatch({type:"setSelected", payload:data})
  }

  const loadData = (data) => {
    dispatch({ type:"load", payload:data})
  }

  return (
    <>
      <Navbar />
      <div>
        <h1>New Translation</h1>
        <div className="result">
          <ButtonLoadPdf setInputURL={setInputURL} handleClickPdf={handleClickPdf} urlInput={state.urlInput} />
          <ButtonEdit
          add={handleClickAdd}
          addBlank={handleClickAddBlank}
          discard={handleClickDiscard}
          undo={handleClickUndo}
          nextPunct={handleClickNextPunct}
          selected={state.selected}
          output={state.output}/>
          <ButtonSaveDraftFile data={state} />
          <ButtonLoadDraftFile loadData={ loadData } />
        </div>
      </div>
      <SubmitDraft data={state}/>
      <LoadDraft loadData={ loadData } />
      <SubmitTranslation data={{newTranslationList : state.newTranslationList}} />
      <LoadTranslation id={state.newTranslationListId} />
      <div className="preview-selected">{state.selected.text}</div>
      <div className="text-container">
        <NewTranslationResult data={state.output} selection = { state.selection }  handleSelection = { handleSelection }/>
        <NewTranslationDraft data={state.newTranslationList} />
      </div>
    </>
  )

}

export default NewTranslation;
