import { useEffect, useState } from "react";
import axios from "axios";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async function () {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(err);
      }
    })();
  }, [url]);

  return { data, error };
}
