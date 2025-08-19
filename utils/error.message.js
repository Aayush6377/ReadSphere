const createError = (message, status = 500) => {
    const error = new Error(message || "Internal Server Error");
    error.status = status;
    return error;
}

export default createError;