import { useEffect, useState } from "react";

export const useSseMock = (seed = 100) => {
  const [value, setValue] = useState(seed);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => prev + Math.round((Math.random() - 0.45) * 10));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return value;
};
