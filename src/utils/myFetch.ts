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

// Set a safe fallback time in seconds (60s = 1 minutes)
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
    cache,
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

  // Configure Next.js caching options
  const nextConfig: { tags?: string[]; revalidate?: number | false } = {};
  if (tags?.length) nextConfig.tags = tags;
  if (revalidate !== undefined) nextConfig.revalidate = revalidate;

  // Cache policy:
  // - Non-GET: always "no-store"
  // - GET: default to "force-cache", default revalidate is DEFAULT_REVALIDATE(60 seconds)
  const resolvedCache: RequestCache = !isGet
    ? "no-store"
    : cache ?? (revalidate === false ? "force-cache" : "default");

  try {
    const response = await fetch(`${process.env.SERVER_URL}${url}`, {
      method,
      headers: reqHeaders,
      ...(body !== undefined && !isGet && {
        body: isFormData ? body : JSON.stringify(body),
      }),
      cache: resolvedCache,
      ...(isGet && Object.keys(nextConfig).length > 0 && { next: nextConfig }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: data?.success ?? true,
        message: data?.message,
        data: data?.data,
        pagination: data?.pagination,
        error: null,
      };
    }

    return {
      success: false,
      message: data?.message,
      data: null,
      error: data?.errorMessages || data?.message || "Request failed",
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