import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { createHttpClient } from "./httpClient";
import { createFilesApi } from "./filesApi";

export function useFilesApi() {
  const { getToken } = useAuth();

  return useMemo(() => {
    const httpClient = createHttpClient(getToken);
    return createFilesApi(httpClient);
  }, [getToken]);
}