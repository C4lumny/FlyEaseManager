import { useState, useEffect, useCallback } from "react";
import { flyEaseApi } from "@/lib/api";

export function useGet(endpoint: string) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();

  const fetch = useCallback(() => {
    setLoading(true);
    flyEaseApi
      .get(endpoint)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [endpoint]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, mutate: fetch };
}