# 🌬️ Wind — @winxs/wind

[![npm version](https://img.shields.io/npm/v/@winxs/wind)](https://www.npmjs.com/package/@winxs/wind)
[![npm downloads](https://img.shields.io/npm/dm/@winxs/wind)](https://www.npmjs.com/package/@winxs/wind)
[![license](https://img.shields.io/npm/l/@winxs/wind)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue)](https://www.typescriptlang.org/)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@winxs/wind)](https://bundlephobia.com/package/@winxs/wind)

**Modern HTTP orchestration client for JavaScript & TypeScript**

> Axios helps you make requests.  
> **Wind helps you manage flows.**

**Wind** is a modern HTTP orchestration client for JavaScript and TypeScript.

> Axios helps you make requests.  
> **Wind helps you manage flows.**

Wind is built for **real-world APIs** — pagination, retries, batching, circuit breakers, and failure-safe third-party integrations.

---

## ✨ Why Wind?

Most HTTP clients stop at `request → response`.

In real systems you also need:

- Pagination without writing loops
- Safe retries
- Partial-failure batch calls
- Protection against unstable third-party APIs
- Worker & SSR-friendly (no global state, isolated clients)
> ⚠️ For SSR or workers, always create a new client using `wind()` or `windClient`.


**Wind provides these as first-class primitives.**

---

## 🚀 Features

- ⚡ **Simple API** (Axios-style defaults)
- 🔁 **Built-in retry support**
- 🔌 **Circuit breaker** for failing APIs
- 📄 **Pagination as async iterators**
- 📦 **Batch requests with partial failures**
- 🧵 **Worker & SSR safe** (no global mutation)
- 🪶 **Lightweight & dependency-minimal**

### 🌍 Runtime Environments

Wind is designed to run in:

- Browsers
- Node.js (18+)
- Workers / Edge runtimes

> Wind does not rely on global mutable state,
making it safe for concurrent and isolated environments.

---

## 📦 Installation

```bash
npm install @winxs/wind
```
## 🧩 Usage
### 1️⃣ Quick (Axios-style)
```ts
import wind from "@winxs/wind";
const users = await wind.get("/users");
```
* The default wind client is shared.
* For production, workers, or multiple APIs — prefer the factory or class.

### 2️⃣ Recommended: Factory API
```ts
import { wind } from "@winxs/wind";

const api = wind({
  baseURL: "https://api.example.com",
});

const users = await api.get("/users");
```
### 3️⃣ Advanced: Isolated Client
```ts
import { windClient } from "@winxs/wind";

const github = new windClient("https://api.github.com");

const repos = await github.get("/users/octocat/repos");
```
### 🔁 Pagination (No Loops)
#### ❌ Traditional approach
```ts
let page = 1;
while (true) {
  const res = await fetch(`/users?page=${page}`);
  if (!res.length) break;
  page++;
}
```
### ✅ Wind way
#### Config : 
```ts
let config ={
  FIXED_PARAMS : {'Env' : 'Prod'},
  TOTAL_SIZE : 10000,
  CHUNK_SIZE : 200,
  stopOnEmpty : true,
  options : {
    method : "POST"
    headers : {authorization : 'Bearer eyeacuh'} 
    body: {}
  },
  PARAMS_KEY?: {
        CHUNK_PAGINATION_KEY: 'Start',
        CHUNK_SIZE_KEY: 'Size'
    };
}
```
```ts

for await (const page of api.paginate("/users", body, config)) {
  console.log(page);
}
```
* Lazy
* Memory-safe
* Failure-aware

### 📦 Batch Requests (Promise.all++)
#### ❌ Traditional
```ts
await Promise.all([
  fetch("/a"),
  fetch("/b"),
]);
```
#### ✅ Wind
```ts
const { results, errors } = await api.batch(
  [
    () => api.get("/a"),
    () => api.get("/b"),
  ],
  { concurrency: 2 }
);
```
* Controlled concurrency
* Partial success support
* No global failures

### 🔌 Circuit Breaker
1. Wind protects your system from unstable APIs.
2. Trips on network failures
3. Trips on 5xx responses
4. Trips on rate-limits (429)
5. Ignores 4xx & validation errors

```ts
await api.get("/third-party"); // auto-protected
```
* When the circuit is open, requests fail fast instead of cascading failures.

### 🔁 Retry Support
```ts
await api.get("/unstable", {
  retry: {
    attempts: 3,
  },
});
```
* Retry happens before circuit breaker evaluation.

### 🔄 Axios → Wind Migration
#### Axios
```ts
import axios from "axios";
axios.get("/users");
```
#### Wind
```ts
import wind from "@winxs/wind";
wind.get("/users");
```
#### Axios Instance
```ts
const api = axios.create({ baseURL });
```
#### Wind Factory
```ts
const api = wind({ baseURL });
```
#### Axios Pagination
```ts
// manual looping
```
#### Wind Pagination
```ts
for await (const page of api.paginate("/users", body, config)) {}
```