export default class TokenExpiredError extends Error {
    constructor() {
        super("Session Expired")
    }
}