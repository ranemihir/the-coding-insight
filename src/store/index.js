/**
 * Vuex store variables.
 */
export const state = () => ({
  currentUser: null
})

/**
 * Mutations for Vuex store variables.
 */
export const mutations = {
  setCurrentUser (state, currentUser) {
    state.currentUser = currentUser
  }
}
