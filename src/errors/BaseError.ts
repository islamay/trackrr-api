

abstract class BaseError extends Error {
    abstract errorType: string
    abstract errorCode: number
    abstract errorMessage: string

    constructor(message: string) {
        super(message)

        Object.setPrototypeOf(this, new.target.prototype)
    }

    serializeError() {
        return {
            errorType: this.errorType,
            errorCode: this.errorCode,
            errorMessage: this.errorMessage
        }
    }
}

export default BaseError
