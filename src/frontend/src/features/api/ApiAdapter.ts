import axios, { HttpStatusCode } from "axios";

const HOST = "http://localhost";
const PORT = 3000;
const URL = `${HOST}:${PORT}/api`;

const apiClient = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function cleanupBeforeCookieRefreshReject(
  error: unknown,
): Promise<typeof error> {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  return Promise.reject(error);
}

function storeTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

class ApiAdapter {
  async getUserById(id: string) {
    const response = await apiClient.get(`/users/${id}`);
    return response;
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const response = await apiClient.post(`/auth/register`, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
    if (
      response.status === HttpStatusCode.Created ||
      response.status === HttpStatusCode.Ok
    ) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response;
  }

  async login(data: { email: string; password: string }) {
    const response = await apiClient.post("/auth/login", data);
    if (response.status === HttpStatusCode.Ok) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("uid", response.data.uid);
    }
    return response;
  }

  async _refreshTokens() {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    const { newAccessToken, newRefreshToken } = response.data;
    storeTokens({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
    return response;
  }

  async isLoggedIn(): Promise<boolean> {
    const accessToken = localStorage.getItem("accessToken");
    const response = await apiClient.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === HttpStatusCode.Ok) {
      return true;
    }

    const refreshResponse = await this._refreshTokens();
    if (refreshResponse.status === HttpStatusCode.Ok) {
      return true;
    }
    return false;
  }

  async updateUserById(id: string, data: object) {
    const response = await apiClient.post(`/users/${id}`, data);
    return response;
  }

  async deleteUserById(id: string) {
    const response = await apiClient.delete(`/users/${id}`);
    return response;
  }

  async getProducts() {
    const response = await apiClient.get("/products");
    return response;
  }

  async getProductById(id: string) {
    const response = await apiClient.get(`/products/${id}`);
    return response;
  }

  async createProduct(data: object) {
    const response = await apiClient.post(`/products`, data);
    return response;
  }

  async updateProductById(id: string, data: object) {
    const response = await apiClient.post(`/products/${id}`, data);
    return response;
  }

  async deleteProductById(id: string) {
    const response = await apiClient.delete(`/products/${id}`);
    return response;
  }

  async refresh(refreshToken: string) {
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response;
  }
}

const apiAdapter = new ApiAdapter();

// Получение токена доступа из localStorage
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Проверка аутентификации пользователя. Идет поиск токенов в localStorage
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!accessToken || !refreshToken) {
        return cleanupBeforeCookieRefreshReject(error);
      }
      try {
        const response = await apiAdapter.refresh(refreshToken);
        const isRefreshExpired = response.data.refresh_expired;
        if (isRefreshExpired) {
          return cleanupBeforeCookieRefreshReject(error);
        }
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        return cleanupBeforeCookieRefreshReject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default apiAdapter;
