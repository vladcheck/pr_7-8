import axios, { AxiosResponse, HttpStatusCode } from "axios";
import { UserLoginResponse, UserResponse } from "@root-shared/types/User";
import { Product, ProductResponse } from "@root-shared/types/Product";

const HOST = "http://localhost";
const PORT = 3000;
const URL = `${HOST}:${PORT}/api`;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

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

class ApiFacade {
  async getUsers() {
    const response = await apiClient.get(`/users`);
    return response;
  }

  async getUserById(id: string) {
    const response: AxiosResponse<UserResponse> = await apiClient.get(
      `/users/${id}`,
    );
    return response;
  }

  async getCurrentUserInfo() {
    if (localStorage.getItem("uid")) {
      const uid = localStorage.getItem("uid");
      const response: AxiosResponse<UserResponse> = await apiClient.get(
        `/users/${uid}`,
      );
      return response;
    }
    return null;
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const response: AxiosResponse = await apiClient.post(`/auth/register`, {
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

  async logOut() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("uid");
    return {};
  }

  async login(data: { email: string; password: string }) {
    const response: AxiosResponse<UserLoginResponse> = await apiClient.post(
      "/auth/login",
      data,
    );
    if (response.status === HttpStatusCode.Ok) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("uid", response.data.uid);
    }
    return response;
  }

  async _refreshTokens() {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(`${URL}/auth/refresh`, { refreshToken });
    if (response.status !== HttpStatusCode.Unauthorized) {
      const { newAccessToken, newRefreshToken } = response.data;
      storeTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }
    return response;
  }

  async isLoggedIn(): Promise<boolean> {
    const accessToken = localStorage.getItem("accessToken");
    const response: AxiosResponse = await apiClient.get("/auth/me", {
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

  async resetPassword(data: object) {
    const currentUserInfo = await this.getCurrentUserInfo();
    const response: AxiosResponse = await apiClient.post(
      `/users/reset/${currentUserInfo?.data.id}`,
      data,
    );
    return response;
  }

  async updateUserById(id: string, data: object) {
    const response: AxiosResponse = await apiClient.post(`/users/${id}`, data);
    return response;
  }

  async deleteUserById(id: string) {
    const response: AxiosResponse = await apiClient.delete(`/users/${id}`);
    if (
      response.status !== HttpStatusCode.BadRequest &&
      response.status !== HttpStatusCode.Unauthorized
    ) {
      document.cookie = "";
      localStorage.clear();
    }
    return response;
  }

  async deleteSelf() {
    const currentUserInfo = await this.getCurrentUserInfo();
    if (currentUserInfo?.data) {
      return this.deleteUserById(currentUserInfo?.data.id);
    }
  }

  async getProducts(author_id?: string, page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const route = "/products";
    const params: string[] = [`page=${page}`, `limit=${limit}`];
    if (author_id) params.push(`author_id=${author_id}`);
    const url = `${route}${params.length > 0 ? "?" + params.join("&") : ""}`;
    const response: AxiosResponse<{ items: Product[]; total: number; page: number; limit: number; totalPages: number }> = await apiClient.get(url);
    return response;
  }

  async getProductById(id: string) {
    const response: AxiosResponse<ProductResponse> = await apiClient.get(
      `/products/${id}`,
    );
    return response;
  }

  async createProduct(data: Omit<Product, "id"> & { author_id: string }) {
    const response: AxiosResponse = await apiClient.post(`/products`, data);
    return response;
  }

  async updateProductById(id: string, data: object) {
    const response: AxiosResponse = await apiClient.post(
      `/products/${id}`,
      data,
    );
    return response;
  }

  async deleteProductById(id: string) {
    const response: AxiosResponse = await apiClient.delete(`/products/${id}`);
    return response;
  }

  async refresh(refreshToken: string) {
    const response: AxiosResponse = await axios.post(`${URL}/auth/refresh`, {
      refreshToken,
    });
    return response;
  }
}

const apiFacade = new ApiFacade();

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
        const response = await apiFacade.refresh(refreshToken);
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

export default apiFacade;
