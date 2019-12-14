const axios = require('axios').default;
export const state = () => ({
  auth: null
})

export const mutations = {
  SET_USER(state, user) {
    state.auth = user
  }
}

export const actions = {
  nuxtServerInit({commit}, {req}) {
    if (req.session && req.session.auth) {
      commit('SET_USER', req.session.auth)
    }
  },
  async login({commit}, {mail, password}) {
    try {
      const {data} = await axios.post('/api/login', {mail, password})
      commit('SET_USER', data)
      console.log(data);
      if (data === 'now login') {
        return 1
      } else {
        return 0
      }


    } catch (e) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  async logout({commit }){
    await axios.post('/api/logout');
    commit('SET_USER', null);
    this.$router.push('/');
  }
}
