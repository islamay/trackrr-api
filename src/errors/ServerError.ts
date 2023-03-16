import BaseError from './BaseError'

class ServerError extends BaseError {
    errorType = 'SERVER_ERROR'
    errorCode = 500
    errorMessage = ''

    constructor(message: string) {
        super(message)
        this.errorMessage = message
    }
}

export default ServerError