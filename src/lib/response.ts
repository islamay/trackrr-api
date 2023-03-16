



const response = (status: string, body?: object) => {
    if (!body) return {
        status
    }

    return {
        status,
        body
    }
}

export default response