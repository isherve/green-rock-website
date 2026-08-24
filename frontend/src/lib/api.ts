import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "@/lib/api-url";

const API_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const status = error.response?.status;
    const data = error.response?.data;
    let message = data?.message ?? error.message ?? "An error occurred";

    if (data?.errors) {
      const details = Object.values(data.errors).flat().filter(Boolean);
      if (details.length > 0) message = details.join(" ");
    }

    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    const apiError = Object.assign(new Error(message), { status }) as Error & {
      status?: number;
    };
    return Promise.reject(apiError);
  }
);

export default api;
