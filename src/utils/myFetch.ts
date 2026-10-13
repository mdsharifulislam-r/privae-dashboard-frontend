/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "./getToken";

export interface FetchResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T | null;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  error?: string | null;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  tags?: string[];
  revalidate?: number | false;
  token?: string;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

const DEFAULT_REVALIDATE = 60;

export const myFetch = async <T = any>(
  url: string,
  {
    method = "GET",
    body,
    tags,
    revalidate = DEFAULT_REVALIDATE,
    token,
    headers = {},
    cache = "no-cache",
  }: FetchOptions = {}
): Promise<FetchResponse<T>> => {
  const accessToken = token || (await getToken());

  const isFormData = body instanceof FormData;
  const isGet = method === "GET";

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const nextConfig: { tags?: string[]; revalidate?: number | false } = {};
  if (tags?.length) nextConfig.tags = tags;
  if (revalidate !== undefined) nextConfig.revalidate = revalidate;

  const resolvedCache: RequestCache = !isGet ? "no-store" : cache;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
      method,
      headers: reqHeaders,
      ...(body !== undefined && !isGet && {
        body: isFormData ? body : JSON.stringify(body),
      }),
      cache: resolvedCache,
      ...(isGet && Object.keys(nextConfig).length > 0 && { next: nextConfig }),
    });

    // 1. Read as text first to prevent JSON parse crashes
    const text = await response.text();
    let data: any = null;

    if (text) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
      }
    }

    // 2. Handle non-OK status codes (e.g., 404, 500 HTML error pages)
    if (!response.ok) {
      return {
        success: false,
        message: data?.message || `HTTP ${response.status}: ${response.statusText}`,
        data: null,
        error:
          data?.errorMessages ||
          data?.message ||
          (data ? null : text || `Server returned status ${response.status}`),
      };
    }

    // 3. Handle OK status codes where the body was not valid JSON
    if (text && !data) {
      return {
        success: false,
        message: "Invalid response format",
        data: null,
        error: "Expected JSON response from server, but received non-JSON payload.",
      };
    }

    // 4. Successful JSON response (or empty 204 No Content)
    return {
      success: data?.success ?? true,
      message: data?.message,
      data: data?.data ?? null,
      pagination: data?.pagination,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Network error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};