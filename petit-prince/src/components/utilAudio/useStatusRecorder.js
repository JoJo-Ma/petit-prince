import React, { useState } from 'react';

const useStatusRecorder = () => {
  const [statusRecorder, setStatusRecorder] = useState({
    recorded: [],
    recordedAndInDb: []
  })

  const updateStatus = (ids, statusType) => {
    switch (statusType) {
      //used on loading data
      case 'NewRecordedAndInDb':
      setStatusRecorder({
        ...statusRecorder,
        recordedAndInDb: [...ids]
      })
      break;
      //used after POST is triggered
      case 'AddRecordedAndInDb':
      setStatusRecorder({
        recorded: statusRecorder.recorded.filter(item => !ids.includes(item)),
        recordedAndInDb: [...statusRecorder.recordedAndInDb, ...ids]
      })
      break;
      case 'DeleteRecordedAndInDb':
      setStatusRecorder({
        ...statusRecorder,
        recordedAndInDb: [...ids]
      })
      break;
      case 'DeleteRecorded':
      setStatusRecorder({
        ...statusRecorder,
        recorded: [...ids]
      })
      break;
      //used when recording stops
      case 'AddRecorded':
      setStatusRecorder({
        ...statusRecorder,
        recorded: [...statusRecorder.recorded, ...ids]
      })
      break;
      default:
      setStatusRecorder({
        recorded: [],
        recordedAndInDb: []
      })
    }
  }
  return { statusRecorder, setStatusRecorder, updateStatus}
}


export default {useStatusRecorder};
