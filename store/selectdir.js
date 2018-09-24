export const state = () => {
    return {
        show: false,
        type: 'move',
        payload: {}
    }
}

export const mutations = {
    SET_STATE (state, opts) {
        state.show = opts.show
        state.type = opts.type || 'move'
        state.payload = opts.payload
    }
}
