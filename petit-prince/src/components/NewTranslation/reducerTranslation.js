export const initialState = {
  urlInput: "",
  output:"Submit PDF URL to display.",
  selected: {
    text: "",
    length: 0
  },
  newTranslationList: [],
  discardedList: [],
  newTranslationListId: 0,
  lastAction: []
}

export const reducer = (state, action) => {
  switch (action.type) {
    case "setUrlInput" :
      return { ...state, urlInput: action.payload}
    case 'reset' :
      return { ...initialState, urlInput: state.urlInput }
    case 'setOutput' :
      return { ...state, output: action.payload}
    case 'add' :
      return { ...state,
        newTranslationList: [ ...state.newTranslationList, {
          id: state.newTranslationListId,
          text: state.selected.text
        }],
        newTranslationListId : state.newTranslationListId + 1,
        discardedList: [...state.discardedList, state.selected.text],
        output: state.output.slice(state.selected.length).trim(),
        lastAction: [...state.lastAction, "Add"],
        selected: {
          text: "",
          length: 0
        }
      }
    case 'addBlank' :
      return { ...state,
        newTranslationList: [ ...state.newTranslationList, {
          id: state.newTranslationListId,
          text: ""
        }],
        newTranslationListId : state.newTranslationListId + 1,
        lastAction: [...state.lastAction, "AddBlank"],
        selected: {
          text: "",
          length: 0
        }
      }
    case 'discard' :
      return { ...state,
        discardedList: [...state.discardedList, state.selected.text],
        output: state.output.slice(state.selected.length).trim(),
        lastAction: [...state.lastAction, "Discard"],
        selected: {
          text: "",
          length: 0
        }
      }
    case 'setSelected' :
      return { ...state, selected: action.payload }
    case 'undo':
      switch (action.payload) {
        case "Add":
          return { ...state,
            output: state.discardedList[state.discardedList.length - 1] + " " + state.output,
            discardedList: state.discardedList.slice(0, -1),
            newTranslationList: state.newTranslationList.slice(0, -1),
            newTranslationListId: state.newTranslationListId - 1,
            lastAction: state.lastAction.slice(0,-1)
          }
        case "Discard":
          return { ...state,
            output: state.discardedList[state.discardedList.length - 1] + " " + state.output,
            discardedList: state.discardedList.slice(0, -1),
            lastAction: state.lastAction.slice(0,-1)
          }
        case "AddBlank" :
          return { ...state,
            newTranslationList: state.newTranslationList.slice(0, -1),
            newTranslationListId: state.newTranslationListId - 1,
            lastAction: state.lastAction.slice(0,-1)
          }
        default :
          return state
      }
    case 'load':
      return action.payload
  }
}
