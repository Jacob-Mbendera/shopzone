

export const getError = (error) => {
    return error.response && error.response.data.message 
    ?error.response.data.message //if error response and error message exists return that otherwise
    :error.message; //return the general error message
}
