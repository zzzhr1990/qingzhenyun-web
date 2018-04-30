export const state = () => {
    return {
        show: false,
        payload: {}
    }
}

export const mutations = {
    SET_STATE (state, opts) {
        state.show = opts.show
        state.payload = opts.payload
    }
}
