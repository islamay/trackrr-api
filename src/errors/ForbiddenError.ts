import BaseError from './BaseError';


class ForbiddenError extends BaseError {
    errorType = 'FORBIDDEN_ERROR'
    errorCode = 403
    errorMessage = ''

    constructor(message: string) {
        super(message)
        this.errorMessage = message
    }
}

export default ForbiddenError