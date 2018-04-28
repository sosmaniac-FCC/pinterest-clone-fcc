const reducer = (state={
    loading: false,
    error: null,
    userId: null,
    successMsg: null,
    failureMsg: null,
    isAuthenticated: false,
    sessionToken: null
}, action) => {
    switch (action.type) {
        case 'CLEAN_USER_MESSAGE': {
            return {
                ...state,
                successMsg: null,
                failureMsg: null
            };
        }
        case 'LOGIN_ACCOUNT_START': {
            return {
                ...state,
                loading: true,
                error: null,
                successMsg: null,
                failureMsg: null,
                userId: null,
                isAuthenticated: false,
                sessionToken: null
            };
        }
        case 'LOGIN_ACCOUNT_SUCCESS': {
            return {
                ...state,
                loading: false,
                userId: action.userId,
                successMsg: action.message,
                isAuthenticated: true,
                sessionToken: action.token
            };
        }
        case 'LOGIN_ACCOUNT_FAIL': {
            return {
                ...state,
                loading: false,
                failureMsg: action.message
            };
        }
        case 'LOGIN_ACCOUNT_ERROR': {
            return {
                ...state,
                loading: false,
                error: action.error
            };
        }
        case 'REGISTER_ACCOUNT_START': {
            return {
                ...state,
                loading: true,
                error: null,
                successMsg: null,
                failureMsg: null
            };
        }
        case 'REGISTER_ACCOUNT_SUCCESS': {
            return {
                ...state,
                loading: false,
                successMsg: action.message
            };
        }
        case 'REGISTER_ACCOUNT_FAIL': {
            return {
                ...state,
                loading: false,
                failureMsg: action.message
            };
        }
        case 'REGISTER_ACCOUNT_ERROR': {
            return {
                ...state,
                loading: false,
                error: action.reason
            };
        }
        case 'AUTHENTICATE_ACCOUNT_START': {
            return {
                ...state,
                loading: true,
                error: null,
                successMsg: null,
                failureMsg: null
            };
        }
        case 'AUTHENTICATE_ACCOUNT_SUCCESS': {
            return {
                ...state,
                loading: false,
                successMsg: action.message,
                isAuthenticated: true
            };
        }
        case 'AUTHENTICATE_ACCOUNT_FAIL': {
            return {
                ...state,
                loading: false,
                failureMsg: action.message,
                isAuthenticated: false
            };
        }
        case 'AUTHENTICATE_ACCOUNT_ERROR': {
            return {
                ...state,
                loading: false,
                error: action.error,
                isAuthenticated: false
            };
        }
        case 'LOGOUT_ACCOUNT_START': {
            return {
                ...state,
                loading: true
            };
        }
        case 'LOGOUT_ACCOUNT_SUCCESS': {
            return {
                ...state,
                loading: false,
                userId: null,
                successMsg: action.message,
                isAuthenticated: false,
                sessionToken: null
            };
        }
        case 'LOGOUT_ACCOUNT_ERROR': {
            return {
                ...state,
                loading: false,
                error: action.error
            };
        }
        case 'ACCOUNT_SUCCESS_MESSAGE': {
            return {
                ...state,
                successMsg: action.message,
                failureMsg: null
            };
        }
        case 'ACCOUNT_FAILURE_MESSAGE': {
            return {
                ...state,
                successMsg: null,
                failureMsg: action.message
            };
        }
        case 'ACCOUNT_CLEAR_MESSAGE': {
            return {
                ...state,
                successMsg: null,
                failureMsg: null
            };
        }
        default: {
            return state;
        }
    }
};

export default reducer;