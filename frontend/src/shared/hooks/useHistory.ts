import { useState, useEffect } from "react";

export default function useHistory(): History | undefined {
  const [history, setHistory] = useState<History>();

  useEffect(() => {
    setHistory(window.history);
  }, [window.history]);

  return history;
}
