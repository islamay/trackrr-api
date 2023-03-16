import BaseError from './BaseError';


class ConflictError extends BaseError {
    errorType = 'CONFLICT_ERROR'
    errorCode = 409
    errorMessage = ''

    constructor(message: string) {
        super(message)
        this.errorMessage = message
    }
}

export default ConflictError