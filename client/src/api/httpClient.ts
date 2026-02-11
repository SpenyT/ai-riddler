import axios from "axios";
import type { GetToken } from "@clerk/types";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export function createHttpClient(getToken: GetToken) {
  const client = axios.create({
    baseURL: BASE_URL,
  });

  client.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
}