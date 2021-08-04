import {
    baseModel,
    modelExtend
} from '../packages'
import {fetch2} from "../server/fetch";


const baseModels = baseModel({
    fetch:fetch2,
    pagination: {
        page_size: 3
    }
});

const model = modelExtend(baseModels, {
    namespaced: true,
    state: () => ({}),
    mutations: {
        save(state, payload) {
            Object.assign(state, payload)
        }
    },
    actions: {
        otherAction({ state }) {
            console.log(state,'state2');
        }
    }
})

export default model