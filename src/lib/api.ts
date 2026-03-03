const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://jsonplaceholder.typicode.com'

type Params = Record<string, string | number | boolean>

interface RequestOptions {
  params?: Params
  headers?: Record<string, string>
}

async function request<T>(
  method: string,
  path: string,
  { params, headers }: RequestOptions = {},
  body?: unknown
): Promise<{ data: T }> {
  let url = `${BASE_URL}${path}`
  if (params) {
    const search = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))
    url += `?${search}`
  }

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = (await response.json()) as T
  return { data }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, options, body),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, options, body),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
}
