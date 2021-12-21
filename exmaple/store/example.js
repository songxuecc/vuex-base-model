import {
    createBaseModel,
    modelExtend
} from '../packages'
import {fetch} from "../server/fetch";


const baseModels = createBaseModel({
    fetch,
});

const model = modelExtend(baseModels, {
    namespaced: true,
    state: () => ({
        pagination: {
            page_size: 5,
            page_index: 1
        }
    }),
    actions: {
        otherAction({ state }) {
            console.log(state.pagination.page_size,'state');
        }
    }
})

export default model