import React, { useState } from 'react';
import DisplayText from './DisplayText'
import LoadTranslations from './LoadTranslations'

export default () => {
  const [data, setData] = useState({})


  const loadData = (input) => {
    setData(input)
  }


  return (
    <>
      <Navbar />
      <LoadTranslations loadData={loadData} />
      <DisplayText data={data} />
    </>
  )
}
