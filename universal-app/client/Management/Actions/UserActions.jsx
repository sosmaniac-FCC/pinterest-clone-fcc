import axios from 'axios';

export function cleanUserMsgs() {
    return (dispatch) => {
        dispatch({ type: "CLEAN_USER_MESSAGE" });
    };
}

export function loginAccount(inputs, success) {
    return (dispatch) => {
        dispatch({ type: "LOGIN_ACCOUNT_START" });
        
        axios.post('/loginUser', {'login-username': inputs['login-username'], 'login-password': inputs['login-password']})
        .then((res) => {
            const response = res.data;
            
            if (!response.failureMsg) {
                dispatch({ type: "LOGIN_ACCOUNT_SUCCESS", message: "Successfully logged in.", userId: response.userId, token: response.token });
                success();
            }
            else {
                dispatch({ type: "LOGIN_ACCOUNT_FAIL", message: response.failureMsg });
            }
        }).catch((error) => {
            dispatch({ type: "LOGIN_ACCOUNT_ERROR", error: error });
        });
    };
}

export function registerAccount(information, success) {
    return (dispatch) => {
        dispatch({ type: "REGISTER_ACCOUNT_START" });
        
        axios.post('/registerUser', { ...information })
        .then((res) => {
            const response = res.data;
            
            if (!response.failureMsg) {
                dispatch({ type: "REGISTER_ACCOUNT_SUCCESS", message: "Account successfully created." });
                success();
            }
            else {
                dispatch({ type: "REGISTER_ACCOUNT_FAIL", message: response.failureMsg });
            }
        }).catch((error) => {
            dispatch({ type: "REGISTER_ACCOUNT_ERROR", error: error });
        });
    };
}

export function authenticateAccount(credentials) {
    return (dispatch) => {
        dispatch({ type: "AUTHENTICATE_ACCOUNT_START" });
        
        axios.get('/authenticate', {
            headers: {
                Authorization: `Bearer ${credentials.jwtToken}`
            }
        }).then((res) => {
            const response = res.data;
            
            if (!response.failureMsg) {
                dispatch({ type: "AUTHENTICATE_ACCOUNT_SUCCESS", message: "" });
            }
            else {
                dispatch({ type: "AUTHENTICATE_ACCOUNT_FAIL", message: response.failureMsg });
            }
        }).catch((error) => {
            dispatch({ type: "AUTHENTICATE_ACCOUNT_ERROR" });
        });
    };
}

export function logoutAccount() {
    return (dispatch) => {
        dispatch({ type: "LOGOUT_ACCOUNT_START" });
        
        axios.get('/logoutUser')
        .then(() => {
            dispatch({ type: "LOGOUT_ACCOUNT_SUCCESS", message: "Successfully logged out." });
            dispatch({ type: "DELETE_PIN_DATA" });
        }).catch((error) => {
            dispatch({ type: "LOGOUT_ACCOUNT_ERROR", error: error }); 
        });
    };
}