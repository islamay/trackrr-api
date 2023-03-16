import BaseError from './BaseError'

class NoContentError extends BaseError {
    errorType = 'NO_CONTENT_ERROR'
    errorCode = 404
    errorMessage = ''

    constructor(message: string) {
        super(message)
        this.errorMessage = message
    }
}

export default NoContentError