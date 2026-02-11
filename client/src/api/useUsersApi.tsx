import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { createHttpClient } from "./httpClient";
import { createUsersApi } from "./usersApi";

export function useUsersApi() {
  const { getToken } = useAuth();

  return useMemo(() => {
    const httpClient = createHttpClient(getToken);
    return createUsersApi(httpClient);
  }, [getToken]);
}