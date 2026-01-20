
/* ================
    Retry Utility
   ================ */

import { classifyError } from "./HttpError";
import { RetryOptions } from "../Interfaces/RetryOptions";

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
    const {
        attempts,
        backOffMs = 30000, //5 mins
        retryOn = ["NETWORK", "TIMEOUT", "RATE_LIMIT", "SERVER", "UNKNOWN"]
    } = options
    let lastError: any;

    for (let i = 0; i < attempts; i++) {
        try {
            let { data, error } = await fn()
            if (!!error) {
                throw error
            }
            return { data, error };        
        } catch (err) {
            let classified = classifyError(err)
            lastError = classified

            if (!retryOn.includes(classified.type)) throw classified
            await new Promise(r => setTimeout(r, backOffMs * (i + 1)));
        }
    }
    throw lastError;
}
