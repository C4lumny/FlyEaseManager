import { useState, useEffect } from "react";
import { flyEaseApi } from "@/lib/api";

export function useGet(endpoint: string) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();

  useEffect(() => {
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

  return { data, loading, error };
}
