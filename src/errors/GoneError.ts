import BaseError from './BaseError';


class GoneError extends BaseError {
    errorType = 'GONE_ERROR'
    errorCode = 410
    errorMessage = ''

    constructor(message: string) {
        super(message)
        this.errorMessage = message
    }
}

export default GoneError