import React, { useEffect, useRef } from 'react';
import Navbar from '../Navbar/Navbar'
import Recorder from './Recorder'

const Record = () => {


  return (
    <>
      <Navbar />
      <h1>Record</h1>
      <Recorder />
    </>
  )
}

export default Record;
