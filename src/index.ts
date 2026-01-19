import { coreRequest } from "./Utility/coreRequest";
import { withRetry } from "./Utility/Retry";
import { CircuitBreaker } from "./Utility/CircuitBreaker";

import { paginate } from "./Helper/Pagination";
import { batch } from "./Helper/Batch";

import { RequestOptions } from "./Interfaces/RequestOptions";
import { PaginationConfig } from "./Interfaces/PaginationConfig";
import { BatchOptions } from "./Interfaces/BatchOptions";

/* ==============================
           windClient
   ============================== */

export class windClient {
    private breaker: CircuitBreaker;

    constructor(private baseURL = "") {
        this.breaker = new CircuitBreaker();
    }

    async request<T>(path: string, options: RequestOptions = {}): Promise<T> {

        if (!this.breaker.canRequest()) {
            throw new Error("Circuit breaker is open");
        }

        const exec = async () => {
            return await coreRequest<T>(this.baseURL + path, options);
        };

        try {
            const result = options.retry ? await withRetry(exec, options.retry) : await exec();

            this.breaker.success();
            return result;

        } catch (err: any) {
            if (this.shouldTripBreaker(err)) {
                this.breaker.failure();
            }
            throw err;
        }
    }

    get<T>(path: string, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: "GET" });
    }

    post<T>(path: string, body: any, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: "POST", body, });
    }

    paginate<T>(path: string, body: any, config?: PaginationConfig,) {
        return paginate<T>(this.post.bind(this), path, body, config);
    }


    batch<T>(tasks: (() => Promise<T>)[], options?: BatchOptions) {
        return batch(tasks, options);
    }


    private shouldTripBreaker(err: any): boolean {
        const status = err?.status;
        if (!status) return true;

        // Server errors
        if (status >= 500) return true;

        // Rate limit
        if (status === 429) return true;

        return false;
    }
}

/* ==============================
        wind() factory API
   ============================== */

export function wind(config: { baseURL?: string } = {}) {
    return new windClient(config.baseURL ?? "");
}

/* ==============================
      Default shared client
   ============================== */

const defaultWind = new windClient();

export default defaultWind;
