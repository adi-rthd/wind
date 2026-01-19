import { RequestOptions } from "./RequestOptions"
export interface PaginationConfig {
    FIXED_PARAMS?: Record<string, string | number>;
    TOTAL_SIZE?: number;
    CHUNK_SIZE?: number;
    stopOnEmpty?: boolean;
    options?: RequestOptions;
    PARAMS_KEY?: {
        CHUNK_PAGINATION_KEY?: string;
        CHUNK_SIZE_KEY?: string;
    };
}
