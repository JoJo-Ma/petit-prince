import { createStore, action } from 'easy-peasy'

const store = createStore({
  login: {
    loggedIn: false,
    setLoggedIn: action((state, payload = true) => {
      state.loggedIn = payload
    })
  },
  naming: {
    name: "",
    setName: action((state, payload) => {
      state.name = payload
    })
  }

})

export default store;
