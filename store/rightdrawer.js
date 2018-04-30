export const state = () => {
    return {
        show: false
    }
}

export const mutations = {
    TOGGER (state) {
        state.show = !state.show
    }
}
