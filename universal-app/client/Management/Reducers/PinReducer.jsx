const reducer = (state={
    loading: false,
    error: null,
    successMsg: null,
    failureMsg: null,
    pinData: null
}, action) => {
    switch (action.type) {
        case 'CLEAN_PIN_MESSAGE': {
            return {
                ...state,
                successMsg: null,
                failureMsg: null
            };
        }
        case 'DELETE_PIN_DATA': {
            return {
                ...state,
                pinData: null
            };
        }
        case 'UPLOAD_PIN_DATA': {
            return {
                ...state,
                pinData: action.data
            };
        }
        case 'GET_PIN_DATA_START': {
            return {
                ...state,
                loading: true,
                error: null,
                successMsg: null,
                failureMsg: null,
                pinData: null
            };
        }
        case 'GET_PIN_DATA_SUCCESS': {
            return {
                ...state,
                loading: false,
                pinData: action.data,
            };
        }
        case 'GET_PIN_DATA_FAIL': {
            return {
                ...state,
                loading: false,
                failureMsg: action.message
            };
        }
        case 'GET_PIN_DATA_ERROR': {
            return {
                ...state,
                loading: false,
                error: action.error
            };
        }
        case 'POST_PIN_START': {
            return {
                ...state,
                loading: true,
                error: null,
                successMsg: null,
                failureMsg: null
            };
        }
        case 'POST_PIN_SUCCESS': {
            return {
                ...state,
                loading: false,
                successMsg: action.message,
                pinData: [...state.pinData, action.newPin]
            };
        }
        case 'POST_PIN_FAIL': {
            return {
                ...state,
                loading: false,
                failureMsg: action.message
            };
        }
        case 'POST_PIN_ERROR': {
            return {
                ...state,
                loading: false,
                error: action.error
            };
        }
        case 'TOGGLE_LIKES_START': {
            return {
                ...state,
                //loading: true,
                error: null,
                successMsg: null,
                failureMsg: null
            };
        }
        case 'TOGGLE_LIKES_SUCCESS': {
            return {
                ...state,
                //loading: false,
                pinData: state.pinData.map((pin) => {
                    if (pin._id == action.pinId) {
                        pin.likes = pin.likes + (+action.result);
                        pin.likers.splice(pin.likers.indexOf(action.userId), 1);
                    }
                    return pin;
                })
            };
        }
        case 'TOGGLE_LIKES_FAIL': {
            return {
                ...state,
                //loading: false,
                failureMsg: action.message
            };
        }
        case 'TOGGLE_LIKES_ERROR': {
            return {
                ...state,
                //loading: false,
                error: action.error
            };
        }
        case 'REMOVE_PIN_START': {
            return {
                ...state,
                //loading: true,
                error: null,
                successMsg: null,
                failureMsg: null
            };
        }
        case 'REMOVE_PIN_SUCCESS': {
            return {
                ...state,
                //loading: false,
                pinData: state.pinData.reduce((accum, pin) => {
                    if (pin._id !== action.id)
                        accum.push(pin);
                    return accum;
                }, [])
            };
        }
        case 'REMOVE_PIN_FAIL': {
            return {
                ...state,
                //loading: false,
                failureMsg: action.message
            };
        }
        case 'REMOVE_PIN_ERROR': {
            return {
                ...state,
                //loading: false,
                error: action.error
            };
        }
        default: {
            return state;
        }
    }
};

export default reducer;