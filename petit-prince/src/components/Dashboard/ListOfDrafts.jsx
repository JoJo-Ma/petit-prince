import React, {useState, useEffect} from 'react';
import useFetchDrafts from '../Util/useFetchDrafts'

import { listOfStringsInArray } from '../Util/text_util'

const ListOfDrafts = ({username}) => {
    const [{loading : loadingDraftList, drafts : draftList, error : errorDraftList}, doFetchDrafts] = useFetchDrafts(username)
    const [listOfDrafts, setListOfDrafts] = useState({
      length: 0,
      languages: []
    })


    useEffect(() => {
      console.log(draftList);
      if(draftList.length > 0) {
        setListOfDrafts({
          length: draftList.length,
          languages: draftList.map((draft) => {
            return draft.language
          })
        })
      }
    }, [draftList])

    return (
      <div className="">
        {
          listOfDrafts.length > 0 ?
          <div>You have {listOfDrafts.length} drafts pending in {listOfStringsInArray(listOfDrafts.languages)}.</div>
          :
          <div>You have no draft saved yet.</div>
        }
      </div>
    )
}

export default ListOfDrafts;
