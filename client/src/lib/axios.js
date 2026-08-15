import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    "VITE_API_URL is not configured."
  );
}

const api = axios.create({
  baseURL: API_URL,

  timeout: 20000,

  withCredentials: true,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let refreshSubscribers = [];

const subscribeTokenRefresh = (
  callback
) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach(
    (callback) => callback(token)
  );

  refreshSubscribers = [];
};

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config;

    const status =
      error.response?.status;

    const requestUrl =
      originalRequest?.url || "";

    const isRefreshRequest =
      requestUrl.includes(
        "/auth/refresh-token"
      );

    const isAuthRequest =
      requestUrl.includes(
        "/customers/login"
      ) ||
      requestUrl.includes(
        "/customers/register"
      ) ||
      requestUrl.includes(
        "/customers/verify-email"
      ) ||
      requestUrl.includes(
        "/customers/resend-verification"
      ) ||
      requestUrl.includes(
        "/admin/login"
      ) ||
      isRefreshRequest;

    if (
      status !== 401 ||
      originalRequest?._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise(
        (resolve, reject) => {
          subscribeTokenRefresh(
            (token) => {
              if (!token) {
                reject(error);
                return;
              }

              originalRequest.headers.Authorization =
                `Bearer ${token}`;

              resolve(
                api(originalRequest)
              );
            }
          );
        }
      );
    }

    isRefreshing = true;

    try {
      const response =
        await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: {
              Accept:
                "application/json",
            },
          }
        );

      const newToken =
        response?.data?.data
          ?.accessToken;

      if (!newToken) {
        throw new Error(
          "Refresh token response did not contain accessToken."
        );
      }

      localStorage.setItem(
        "token",
        newToken
      );

      onTokenRefreshed(newToken);

      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      refreshSubscribers.forEach(
        (callback) =>
          callback(null)
      );

      refreshSubscribers = [];

      clearAuth();

      const currentPath =
        window.location.pathname;

      if (
        currentPath.startsWith(
          "/admin"
        )
      ) {
        window.location.href =
          "/admin/login";
      } else {
        window.location.href =
          "/login";
      }

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;