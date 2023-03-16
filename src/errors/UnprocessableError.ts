import BaseError from './BaseError';


class UnprocessableError extends BaseError {
    errorType = 'UNPROCESSABLE_ENTITY_ERROR'
    errorCode = 422
    errorMessage = ''

    constructor(message: string) {
        super(message)
        this.errorMessage = message
    }
}

export default UnprocessableError