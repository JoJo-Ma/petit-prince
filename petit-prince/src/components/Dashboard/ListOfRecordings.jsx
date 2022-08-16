import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { baseUrl } from '../Util/apiUrl';


const ListOfRecordings = ({username}) => {

  const [listOfRecordings, setListOfRecordings] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${baseUrl}/blobtesting/statusRecordingSummary/${username}`, {
        method: "GET",
        headers: {token : localStorage.token}
      })
      const parseRes = await response.json()
      const data = parseRes.map(el => {
        return {
          language: el.name,
          count: el.count,
          ratio: (el.count / 1168 * 100).toFixed()
        }
      })
      setListOfRecordings(data)
    }
    // if (isInitialMount.current) {
    //   isInitialMount.current = false;
    //   return
    // }
    try {
      fetchData()
    } catch (error) {
      console.error(error.message);
    }
  }, [username])


    return (
      <div className="">
        {
          listOfRecordings.length > 0 ?
          <div>
            {listOfRecordings.map((recording, index) => {
                return <p>You have recorded <b>{recording.count}</b> sentences in <b>{recording.language}</b>. (<b>{recording.ratio}%</b> completion)</p>
              })}
            Go to the <Link to="/record">record</Link> section
          </div>
          :
          <div>You haven't recorded any sentence yet.</div>
        }
      </div>
    )
}

export default ListOfRecordings;
