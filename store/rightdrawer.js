export const state = () => {
    return {
        show: false
    }
}

export const mutations = {
    TOGGLE (state) {
        state.show = !state.show
    },

    SHOW (state) {
        state.show = true
    },

    HIDE (state) {
        state.show = false
    }
}
