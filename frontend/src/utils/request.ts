const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

export function request(url: string, options: RequestInit = {}) {
  return fetch(`${BASE_URL}${url}`, options)
    .then((result) => {
      if (result.status === 400) {
        throw new Error("Bad Request");
      } else if (result.status === 500) {
        throw new Error("Internal Server Error");
      } else {
        return result.json();
      }
    })
    .catch((err) => {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    });
}
