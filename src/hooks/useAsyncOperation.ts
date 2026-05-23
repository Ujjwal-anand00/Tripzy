import { useState } from "react";

export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async <T,>(operation: () => Promise<T>) => {
    setLoading(true);
    setError(null);

    try {
      return await operation();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Something went wrong";
      setError(message);
      throw caughtError;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run, setError };
};
