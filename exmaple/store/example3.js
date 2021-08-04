import {
    baseModel,
    modelExtend
} from '../packages'
import {fetch3} from "../server/fetch";


const baseModels = baseModel({
    fetch:fetch3,
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