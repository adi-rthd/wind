
/* ==============================
            Core Request 
   ============================== */

import { HttpError } from "./HttpError";
import { RequestOptions } from "../Interfaces/RequestOptions";

export async function coreRequest<T>(url: string, options: RequestOptions): Promise<T> {
    const controller = new AbortController();
    if (options.timeoutMS) {
        setTimeout(() => controller.abort(), options.timeoutMS);
    }
    let finalUrl = url;
    if (options.params) {
        const searchParams = new URLSearchParams(
            Object.entries(options.params).map(([key, value]) => [
                key,
                String(value)
            ])
        );
        finalUrl += `?${searchParams.toString()}`;
    }
    const res = await fetch(finalUrl, {
        method: options.method ?? "GET",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : void 0,
        signal: controller.signal
    });
    let text;
    try {
        text = await res.text();
    } catch {
        throw new HttpError("Failed to read response", "NETWORK", res.status);
    }
    let data = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            throw new HttpError("Invalid JSON Response", "SCHEMA", res.status, text);
        }
    }
    if (!res.ok) {
        throw new HttpError("HTTP Error", "CLIENT", res.status, data);
    }
    return data;
}
