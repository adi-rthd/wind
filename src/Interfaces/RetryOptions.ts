import { ErrorType } from "../Types/ErrorType";

export interface RetryOptions {
    attempts: number;
    backOffMs?: number;
    retryOn?: ErrorType[];
}