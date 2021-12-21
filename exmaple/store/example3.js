import {
    createBaseModel,
    modelExtend
} from '../packages'
import {fetch3} from "../server/fetch";


const baseModels = createBaseModel({
    fetch:fetch3,
});

const model = modelExtend(baseModels, {
    namespaced: true,
    state: () => ({}),
    actions: {
        otherAction({ state }) {
            console.log(state.pagination.page_size,'state');
        }
    }
})

export default model