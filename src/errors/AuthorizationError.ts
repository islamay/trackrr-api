import BaseError from './BaseError';


class AuthorizationError extends BaseError {
    errorType = 'AUTHORIZATION_ERROR'
    errorCode = 401
    errorMessage = ''

    constructor(message: string) {
        super(message)
        this.errorMessage = message
    }
}

export default AuthorizationError