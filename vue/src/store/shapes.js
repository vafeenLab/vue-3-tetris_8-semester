import { BASE_PIECES } from '../constants/constants'

export default {
  namespaced: true,
  state() {
    return {
      customShapes: []
    }
  },
  getters: {
    getAllShapes: (state) => [...BASE_PIECES, ...state.customShapes],
    getShapeById: (state) => (id) => {
      const custom = state.customShapes.find(p => p.id === id)
      if (custom) return custom
      return BASE_PIECES.find(p => p.id === id)
    }
  },
  mutations: {
    ADD_SHAPE: (state, shape) => {
      state.customShapes.push(shape)
    },
    UPDATE_SHAPE: (state, { id, ...updates }) => {
      const index = state.customShapes.findIndex(s => s.id === id)
      if (index !== -1) {
        state.customShapes[index] = { ...state.customShapes[index], ...updates }
      } else {
        const baseShape = BASE_PIECES.find(p => p.id === id)
        if (baseShape) {
          state.customShapes.push({ ...baseShape, ...updates })
        }
      }
    },
    DELETE_SHAPE: (state, id) => {
      state.customShapes = state.customShapes.filter(s => s.id !== id)
    }
  },
  actions: {
    addShape: ({ commit }, shape) => {
      commit('ADD_SHAPE', shape)
    },
    updateShape: ({ commit }, shape) => {
      commit('UPDATE_SHAPE', shape)
    },
    deleteShape: ({ commit }, id) => {
      commit('DELETE_SHAPE', id)
    }
  }
}