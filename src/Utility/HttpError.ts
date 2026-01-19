import { ErrorType } from "../Types/ErrorType";

/* ==============================
    Error Types & Classification
   ============================== */


export class HttpError extends Error {
    type: ErrorType;
    status?: number;
    response?: any;

    constructor(message: string, type: ErrorType, status?: number, response?: any) {
        super(message)
        this.type = type;
        this.status = status;
        this.response = response;
    }
}
export function classifyError(err: any): HttpError {
    if (err instanceof HttpError) return err;
    if (err.name === "AbortError") return new HttpError("Request Timed Out", "TIMEOUT")
    if (err.status) {
        if (err.status === 429) return new HttpError("Rate limited", "RATE_LIMIT", 429);
        if (err.status >= 500) return new HttpError("Server error", "SERVER", err.status);
        if (err.status >= 400) return new HttpError("Client error", "CLIENT", err.status);
    }

    return new HttpError(err.message || "Unknown error", "UNKNOWN");
}