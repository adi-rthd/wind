
/* ================
    Retry Utility
   ================ */

import { classifyError } from "./HttpError";
import { RetryOptions } from "../Interfaces/RetryOptions";

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
    const {
        attempts,
        backOffMs = 300, //5 mins
        retryOn = ["NETWORK", "TIMEOUT", "RATE_LIMIT", "SERVER"]
    } = options
    let lastError: any;

    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (err) {
            let classified = classifyError(err)
            lastError = classified

            if (!retryOn.includes(classified.type)) throw classified
            await new Promise(r => setTimeout(r, backOffMs * (i + 1)));
        }
    }
    throw lastError;
}
