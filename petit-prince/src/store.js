import { createStore, action } from 'easy-peasy'

const store = createStore({
  login: {
    loggedIn: false,
    setLoggedIn: action((state) => {
      state.loggedIn = true
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
