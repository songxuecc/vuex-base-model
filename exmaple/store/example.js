import {
    baseModel,
    modelExtend
} from '../packages'
import {fetch} from "../server/fetch";


const baseModels = baseModel({
    fetch,
    pagination: {
        page_size: 1
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
            console.log(state,'state');
        }
    }
})

export default model