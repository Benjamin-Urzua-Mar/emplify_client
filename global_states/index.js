import {createGlobalState} from  'react-hooks-global-state'

const {setGlobalState, useGlobalState} = createGlobalState({
    vistaAdmin:'inicial'
})

export {useGlobalState, setGlobalState}