import { BatchOptions } from "../Interfaces/BatchOptions";
import { HttpError } from "../Utility/HttpError";


export async function batch<T>(
  tasks: (() => Promise<T>)[],
  options: BatchOptions = {}
) {
  const concurrency = options.concurrency ?? tasks.length;
  const failFast = options.failFast ?? false;

  const results: T[] = [];
  const errors: HttpError[] = [];

  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const i = index++;
      try {
        results[i] = await tasks[i]();
      } catch (err) {
        errors[i] = err as HttpError;
        if (failFast) throw err;
      }
    }
  }

  await Promise.all(
    Array.from({ length: concurrency }, worker)
  );

  return { results, errors };
}
