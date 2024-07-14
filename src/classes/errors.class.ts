import errorsContants from "../constants/errors.contants";

/**
 * Error emitted by Not avariable Proxyname in the server
 */
export class ErrorNotAvariableProxyName extends Error {
    /**
     * Data of error
     */
    public readonly data = errorsContants.NO_AVARIABLE_PROXYNAME;
}

/**
 * Error emmited by unknow error in the server
 */
export class ErrorUnknow extends Error {
    /**
     * Data of error
     */
    public readonly data = errorsContants.UNKNOWN_ERROR;
}