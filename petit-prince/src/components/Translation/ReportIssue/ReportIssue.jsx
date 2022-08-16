import React, { useState, useEffect } from 'react';
import ModalTranslation from '../../Util/ModalTranslation'
import Select from 'react-select'
import {issueTypes, audioIssueTypes, textIssueTypes} from './issueTypes'
import { baseUrl } from '../../Util/apiUrl';


const ReportIssue = ({recordingUser, selectedSentence}) => {

    const [languageOptions, setLanguageOptions] = useState()
    const [language, setLanguage] = useState(null)
    const [typeOptions, setTypeOptions] = useState()
    const [subTypeOptions, setSubTypeOptions] = useState(null)
    const [type, setType] = useState(null)
    const [subType, setSubType] = useState(null)
    const [comment, setComment] = useState("")
    const [alertMessage, setAlertMessage] = useState(null)

    const handleChange = (e, sub=false) => {
      if(sub) {
        setSubType(subTypeOptions.find(subTypeOption => subTypeOption.value === e.value).value)
        return
      }
      setType(typeOptions.find(typeOption => typeOption.value === e.value).value)
      setSubType(null)

    }

    const handleTextAreaChange = (e) => {
      setComment(e.target.value)
    }

    const handleLanguageChange = (e) => {
      setLanguage(languageOptions.find(languageOption => languageOption.value === e.value).value)
    }

    const submit = async (e) => {
      e.preventDefault()
      if (!type || !language || !subType) {
        setAlertMessage("Missing fields!")
        return
      }
      const audio_username = type === "AUDIO" ? recordingUser : null
      try {
        const body = {
          language,
          type,
          subtype: subType,
          comment,
          audio_username,
          currentId:selectedSentence.id
        }
        const response = await fetch(`${baseUrl}/issuelog/`, {
          method: "POST",
          headers: { "Content-Type": "application/json",
          token : localStorage.token },
          body: JSON.stringify(body)
        })

        if(response.status !== 200) throw new Error('Error while sending the issue. :(')
        setAlertMessage('Issue sent successfully!')
      } catch (error) {
        console.error(error.message);
        setAlertMessage('Error while sending the issue. :(')
      }
    }


    useEffect(() => {
      if(!selectedSentence) return
      setLanguageOptions([
        { value: selectedSentence.languageOneText, label: selectedSentence.languageOneText},
        { value: selectedSentence.languageTwoText, label: selectedSentence.languageTwoText}
      ])
    },[selectedSentence])

    useEffect(() => {
      setTypeOptions(issueTypes.map((issueType) => { return {
        value: issueType, label: issueType}}))
    }, [])

    useEffect(() => {
      if(alertMessage === null) return
      const timer = setTimeout(() => setAlertMessage(null), 3000)
      return () => clearTimeout(timer)
    }, [alertMessage])

    useEffect(() => {
      switch (type) {
        case "AUDIO":
          setSubTypeOptions(audioIssueTypes.map((audioIssueType) => { return {
            value: audioIssueType, label: audioIssueType}}))
          break;
        case "TEXT":
          setSubTypeOptions(textIssueTypes.map((textIssueType) => { return {
            value: textIssueType, label: textIssueType}}))
          break;
        case "OTHER":
          setSubTypeOptions(null)
          break;
        default:
          return
      }
    }, [type])

    useEffect(() => {
      setSubType(null)
      if (type === "AUDIO") {
        setLanguage(selectedSentence.languageOneText)
      }
    }, [type])

  return (
      <ModalTranslation className="report-issue-button"
        buttonText="Report Issue"
        >
        <div className="report-issue-container">
          <h3>Report an issue</h3>
          <p><b>{selectedSentence.languageOneText}</b> : {selectedSentence.languageOne}</p>
          <p><b>{selectedSentence.languageTwoText}</b> : {selectedSentence.languageTwo}</p>
          <p>Recording author : <b>{recordingUser}</b></p>
          <Select className="react-select-container"
          classNamePrefix="react-select"
          options={typeOptions}
          onChange={(e) => handleChange(e)}
          placeholder={'Select type of issue...'}
          theme={(theme) => ({
            ...theme,
            borderRadius:0,
            colors: {
              ...theme.colors,
              primary: '#408CA2',
              primary25: '#AFD8E5'
            }
          })}
          openMenuOnFocus={true}
          />
          <Select className="react-select-container"
          classNamePrefix="react-select"
          options={languageOptions}
          onChange={(e) => handleLanguageChange(e, true)}
          placeholder={'Select language...'}
          theme={(theme) => ({
            ...theme,
            borderRadius:0,
            colors: {
              ...theme.colors,
              primary: '#408CA2',
              primary25: '#AFD8E5'
            }
          })}
          openMenuOnFocus={true}
          isDisabled={type==="AUDIO"}
          value={ language ?
            {value: language, label: language}
            : null
          }
          />
          {
            type != "OTHER" &&

            <Select className="react-select-container"
            classNamePrefix="react-select"
            options={subTypeOptions}
            onChange={(e) => handleChange(e, true)}
            placeholder={'Select issue...'}
            theme={(theme) => ({
              ...theme,
              borderRadius:0,
              colors: {
                ...theme.colors,
                primary: '#408CA2',
                primary25: '#AFD8E5'
              }
            })}
            openMenuOnFocus={true}
            value={subType ? {
              value: subType,
              label: subType
            } :
            null}
            />
          }

          <textarea onChange={(e) => handleTextAreaChange(e)} className="report-issue-comment" value={comment} name="comment" rows="3" placeholder="Comment" ></textarea>
          <button type="button" onClick={(e) => submit(e)}>Submit</button>
          {
            alertMessage &&
            <p className="report-issue-alert" style={{textAlign:'center'}}>{alertMessage}</p>
          }
        </div>
        </ModalTranslation>
  )
}

export default ReportIssue;
