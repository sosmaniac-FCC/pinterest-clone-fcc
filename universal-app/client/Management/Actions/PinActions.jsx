import axios from 'axios';

export function cleanPinMsgs() {
    return (dispatch) => {
        dispatch({ type: "CLEAN_PIN_MESSAGE" });  
    };
}

export function cleanData() {
    return (dispatch) => {
        dispatch({ type: "DELETE_PIN_DATA" });  
    };
}

export function getPinData(id) {
    return (dispatch) => {
        dispatch({ type: "GET_PIN_DATA_START" });
        
        axios.get('/fetchPins' + (id ? `?id=${id}` : ''))
        .then((res) => {
            const response = res.data;
            
            if (!response.failureMsg) {
                dispatch({ type: "GET_PIN_DATA_SUCCESS", data: response });
            }
            else {
                dispatch({ type: "GET_PIN_DATA_FAIL", message: res.failureMsg });
            }
        }).catch((error) => {
            dispatch({ type: "GET_PIN_DATA_ERROR", error: error }); 
        });
    };
}

export function postPin(information, success) {
    return (dispatch) => {
        dispatch({ type: "POST_PIN_START" });
        
        axios.post('/createPin', information)
        .then((res) => {
            const response = res.data;
            
            console.log(response);
            
            if (!response.failureMsg) {
                dispatch({ type: "POST_PIN_SUCCESS", message: "Pin successfully posted.", newPin: response.pin });
                success(response.pin);
            }
            else {
                dispatch({ type: "POST_PIN_FAIL", message: response.failureMsg });
                success(false);
            }
        }).catch((error) => {
            dispatch({ type: "POST_PIN_ERROR", error: error });
            success(false);
        });
    };
}

export function updatePinLikes(credentials, success) {
    return (dispatch) => {
        dispatch({ type: "TOGGLE_LIKES_START" });
        
        axios.put('/toggleLikes', credentials)
        .then((res) => {
            const response = res.data;
            
            if (!response.failureMsg) {
                dispatch({ type: "TOGGLE_LIKES_SUCCESS", ...credentials, result: response.result });
                
                if (response.result > 0)
                    success(true);
                else 
                    success(false);
            }
            else {
                dispatch({ type: "TOGGLE_LIKES_FAIL", message: response.failureMsg });
                success(null);
            }
        }).catch((error) => {
            dispatch({ type: "TOGGLE_LIKES_ERROR", error: error }); 
            success(null);
        });
    };
}

export function removePin(id, success) {
    return (dispatch) => {
        dispatch({ type: "REMOVE_PIN_START" });
        
        axios.delete(`/deletePin?id=${id}`)
        .then((res) => {
            const response = res.data;
            
            if (!response.failureMsg) {
                dispatch({ type: "REMOVE_PIN_SUCCESS", id: response._id });
                success(true);
            }
            else {
                dispatch({ type: "REMOVE_PIN_FAIL", message: response.failureMsg });
                success(false);
            }
        }).catch((error) => {
            dispatch({ type: "REMOVE_PIN_ERROR", error: error });
            success(false);
        });
    };
}