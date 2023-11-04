// https://github.com/robinvdvleuten/vuex-persistedstate
import createPersistedState from 'vuex-persistedstate'

// @ts-ignore
export default ({ store }) => {
  createPersistedState({
    key: 'hotelManager',
    paths: ['account', 'cancelPolicy'],
    storage: window.sessionStorage,
  })(store)
}
