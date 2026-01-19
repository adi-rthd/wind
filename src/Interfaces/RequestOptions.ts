import { RetryOptions } from "./RetryOptions";

export interface RequestOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    timeoutMS?: number;
    params?: any;
    retry?: RetryOptions;
}