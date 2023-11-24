import {createGlobalState} from  'react-hooks-global-state'

const {setGlobalState, useGlobalState} = createGlobalState({
    searchResults:[]
})

export {useGlobalState, setGlobalState}