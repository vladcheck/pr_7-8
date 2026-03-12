import axios from "axios";

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
    return response;
  }

  async updateUserById(id: string, data: object) {
    const response = await apiClient.post(`/users/${id}`, data);
    return response;
  }

  async deleteUserById(id: string) {
    const response = await apiClient.delete(`/users/${id}`);
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
}

const apiAdapter = new ApiAdapter();
export default apiAdapter;
