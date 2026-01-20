import { PaginationConfig } from "../Interfaces/PaginationConfig";
import { RequestOptions } from "../Interfaces/RequestOptions";

export async function* paginate<T>(fetcher: (url: string, options?: RequestOptions) => Promise<T>, path: string, body: any, config: PaginationConfig = {}): AsyncGenerator<T> {

  let FIXED_PARAMS = "";

  if (config.FIXED_PARAMS) {
    Object.entries(config.FIXED_PARAMS).forEach(
      ([key, value]) => FIXED_PARAMS += `&${key}=${value}`
    );
  }
  const pages = pagination(config.TOTAL_SIZE, config.CHUNK_SIZE);

  const CHUNK_PAGINATION_KEY = config.PARAMS_KEY?.CHUNK_PAGINATION_KEY;
  const CHUNK_SIZE_KEY = config.PARAMS_KEY?.CHUNK_SIZE_KEY;

  if (Array.isArray(pages)) {
    for (const page of pages) {
      const paramsPath = `${CHUNK_PAGINATION_KEY}=${page.CHUNK_START}` + `&${CHUNK_SIZE_KEY}=${page.CHUNK_SIZE}` + FIXED_PARAMS;

      const data = await fetcher(`${path}?${paramsPath}`, body, { ...config.options });

      if (config.stopOnEmpty !== false && (!data || (Array.isArray(data) && data.length === 0))) {
        break;
      }

      yield data;
    }
  }
}

function pagination(TOTAL_SIZE = 2000, CHUNK_SIZE = 2000, start = 1) {
  try {
    const totalChunks = Math.ceil(TOTAL_SIZE / CHUNK_SIZE);
    CHUNK_SIZE = TOTAL_SIZE < CHUNK_SIZE ? TOTAL_SIZE : CHUNK_SIZE
    const requests = Array.from({ length: totalChunks }, (_, index) => {
      const CHUNK_START = start + index * CHUNK_SIZE;

      return { CHUNK_START, CHUNK_SIZE }
    })
    return requests

  } catch (error) {
    throw error
  }
}
