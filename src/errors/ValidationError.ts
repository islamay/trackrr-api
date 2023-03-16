import BaseError from './BaseError'

class ValidationError extends BaseError {
    errorType = 'VALIDATION_ERROR'
    errorCode = 400
    errorMessage = ''

    constructor(message: string) {
        super(message)
        this.errorMessage = message
    }
}

export default ValidationError
