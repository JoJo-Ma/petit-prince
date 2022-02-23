// will handle importing pdfs to temporary state, then trimming, breaking down into
// individual strings and saving to db

import React, { useState, useEffect, useRef} from 'react';
import Navbar from '../Navbar/Navbar'
import NewTranslationResult from './NewTranslationResult'
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

  const [ urlInput, setUrlInput ] = useState("")
  const [ output, setOutput] = useState("Submit PDF URL to display.")
  const [ selected, setSelected] = useState({
    text: "",
    length: 0
  })
  const [ newTranslationList, setNewTranslationList ] = useState([])
  const [ discardedList, setDiscardedList ] = useState([])
  const [ newTranslationListId, setNewTranslationListId] = useState(0)
  const [ lastAction, setLastAction] = useState([])


  const onChangeURL = (e) => {
    setUrlInput(e.target.value)
  }

  // retrieves selected text from the imported pdf text along with useEffect right below
  const handleSelection = () => {
    const text = document.getSelection().toString()
    const selection = {
      text: text,
      length: text.length

    }
    if (text === output.slice(0, selection.length)) {
      setSelected(selection)
    }
  }
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
    };
  })


// retrieves the text from the pdf
  const handleClickPdf = async (e) => {
    e.preventDefault()
    setNewTranslationListId(0)
    setNewTranslationList([])
    setDiscardedList([])
    setLastAction([])
    setSelected({
      text: "",
      length: 0
    })
    setOutput("Loading...")
    try {
      const body = { url: urlInput }

      const response = await fetch("http://localhost:3005/pdfparser", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(body)
      } )

      const parseRes = await response.text()

      setOutput(parseRes.replace(/\s{2,}/g, ' ').trim())
    } catch (error) {
      setOutput("There was an error loading the file with following error:",error.message )
      console.error(error.message);
      return
    }
  }

  // adds selection to new list and removes it from source text
  const handleClickAdd = () => {
    if (selected.length === 0) {
      return
    }
    setNewTranslationList([...newTranslationList, {
      id: newTranslationListId,
      text:selected.text
    }])
    setNewTranslationListId(newTranslationListId + 1)
    setDiscardedList([...discardedList, selected.text])
    setOutput(output.slice(selected.length).trim())
    setLastAction([...lastAction, "Add"])
    setSelected({
      text: "",
      length: 0
    })
  }

  const handleClickAddBlank = () => {
    setNewTranslationList([...newTranslationList, {
      id: newTranslationListId,
      text: ""
    }])
    setNewTranslationListId(newTranslationListId + 1)
    setLastAction([...lastAction, "AddBlank"])
    setSelected({
      text: "",
      length: 0
    })
  }

  // cancels previous addition to list
  const handleClickUndo = () => {
    if (newTranslationListId === 0) {
      return
    }
    switch(lastAction[lastAction.length - 1]) {
      case "Add":
        setOutput(discardedList[discardedList.length-1] + " " + output)
        setDiscardedList(discardedList.slice(0,-1))
        setNewTranslationList(newTranslationList.slice(0,-1))
        setNewTranslationListId(newTranslationListId - 1)
        break
      case "Discard":
        setOutput(discardedList[discardedList.length-1] + " " + output)
        setDiscardedList(discardedList.slice(0,-1))
        break
      case "AddBlank":
        setNewTranslationList(newTranslationList.slice(0,-1))
        setNewTranslationListId(newTranslationListId - 1)
        break
      default :
        return
    }
    setLastAction(lastAction.slice(0,-1))
  }

  //discards selected area (useless test, unwanted characters, etc)
  const handleClickDiscard = () => {
    if (selected.length === 0) {
      return
    }
    setDiscardedList([...discardedList, selected.text])
    setOutput(output.slice(selected.length).trim())
    setLastAction([...lastAction, "Discard"])
    setSelected({
      text: "",
      length: 0
    })
  }

  const handleClickNextPunct = () => {
    //regex to find next the punctuation character in text, support for other languages to be added when needed
    const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~﹒。“”‘’「」『』、·《》〈〉…！？（）]/
    if (selected.length > 0) {
      const offsetIndex = punctuationRegex.exec(output.slice(selected.length)).index
      setSelected({
        text: selected.text + output.slice(selected.length,selected.length + offsetIndex + 1),
        length: selected.length + offsetIndex + 1
      })
      return
    }
    setSelected({
      text:output.slice(0,punctuationRegex.exec(output).index + 1),
      length:punctuationRegex.exec(output).index + 1
    })
  }

  const handleClickSaveJson = () => {
    const json = {
      urlInput,
      output,
      selected,
      newTranslationList,
      discardedList,
      newTranslationListId,
      lastAction,
    }
    const blob = new Blob([JSON.stringify(json, null, 2)], {type : 'application/json'})
    const toSave = document.createElement('a');
    toSave.download = "save.json"
    toSave.href = URL.createObjectURL(blob)
    toSave.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(toSave.href), 30 * 1000)
    })
    toSave.click()

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
          setUrlInput(json.urlInput)
          setOutput(json.output)
          setDiscardedList(json.discardedList)
          setLastAction(json.lastAction)
          setNewTranslationList(json.newTranslationList)
          setNewTranslationListId(json.newTranslationListId)
          setSelected(json.selected)
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
    <div >
      <h1>New Translation</h1>
      <div className="result">
      <input type="text" name="url" placeholder="URL" onChange={e => onChangeURL(e)}/>
      <button type="button" onClick={handleClickPdf}>Submit</button>
      <button type="button" onClick={handleClickAdd}>Add Selection</button>
      <button type="button" onClick={handleClickAddBlank}>Add blank</button>
      <button type="button" onClick={handleClickDiscard}>Discard</button>
      <button type="button" onClick={handleClickUndo}>Undo</button>
      <button type="button" onClick={handleClickNextPunct}>Next sentence</button>
      <button type="button" onClick={handleClickSaveJson}>Save file</button>
      <p>Load file</p>
      <input type="file" id="file-selector" accept=".json" />
      </div>
      <SubmitDraft data={{urlInput,
            output,
            selected,
            newTranslationList,
            discardedList,
            newTranslationListId,
            lastAction,}}/>
      <LoadDraft />
      <div className="preview-selected">{selected.text}</div>
      <div className="text-container">
      <div className="pdf-to-text" >
      <NewTranslationResult data={output} />
      </div>
      <div className="pdf-to-text no-select" >
      {
        newTranslationList.map((newTranslationItem) => {
          return (<div key={newTranslationItem.id}>{newTranslationItem.text}</div> )
        })
      }
      </div>
      </div>
    </div>
    </>
  )

}

export default NewTranslation;
