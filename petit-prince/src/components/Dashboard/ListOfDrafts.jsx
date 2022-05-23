import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import useFetchDrafts from '../Util/useFetchDrafts'

import { listOfStringsInArray } from '../Util/text_util'

const ListOfDrafts = ({username}) => {
    const [{loading : loadingDraftList, drafts : draftList, error : errorDraftList}, doFetchDrafts] = useFetchDrafts(username)
    const [listOfDrafts, setListOfDrafts] = useState({
      length: 0,
      languages: []
    })


    useEffect(() => {
      if(draftList.length > 0) {
        setListOfDrafts({
          length: draftList.length,
          languages: [...new Set(draftList.map((draft) => {
            return draft.language
          }))]
        })
      }
    }, [draftList])

    return (
      <div className="">
        {
          listOfDrafts.length > 0 ?
          <div>You have <b>{listOfDrafts.length}</b> {listOfDrafts.length > 1 ? 'drafts' : 'draft'} pending in <b>{listOfStringsInArray(listOfDrafts.languages)}</b>.
            Go to <Link to="/newtranslation">new translation</Link></div>
          :
          <div>You have no draft saved yet.</div>
        }
      </div>
    )
}

export default ListOfDrafts;
