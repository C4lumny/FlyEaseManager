import axios from "axios";

export const flyEaseApi = axios.create({
  baseURL: "http://flyeaseapi-dev-env.eba-sbxyzdge.us-east-2.elasticbeanstalk.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
flyEaseApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("primaryToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
flyEaseApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const primaryToken = localStorage.getItem("primaryToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/FlyEaseApi/Administradores/GetRefreshToken", {
          expiredToken: primaryToken,
          refreshToken,
        });
        const { tokens } = response.data;

        localStorage.setItem("primaryToken", tokens.primaryToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${tokens.primaryToken}`;
        return axios(originalRequest);
      } catch (error) {
        // Handle refresh token error or redirect to login
      }
    }

    return Promise.reject(error);
  }
);
