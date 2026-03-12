import axios from "axios";

const HOST = "http://localhost";
const PORT = 3000;
const URL = `${HOST}:${PORT}/api`;

class ApiAdapter {
  async getUserById(id: string) {
    const response = await axios.get(`${URL}/users/${id}`);
    return response;
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const response = await axios.post(`${URL}/auth/register`, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
    return response;
  }

  async updateUserById(id: string, data: object) {
    const response = await axios.post(`${URL}/users/${id}`, data);
    return response;
  }

  async deleteUserById(id: string) {
    const response = await axios.delete(`${URL}/users/${id}`);
    return response;
  }

  async getProductById(id: string) {
    const response = await axios.get(`${URL}/products/${id}`);
    return response;
  }

  async createProduct(data: object) {
    const response = await axios.post(`${URL}/products`, data);
    return response;
  }

  async updateProductById(id: string, data: object) {
    const response = await axios.post(`${URL}/products/${id}`, data);
    return response;
  }

  async deleteProductById(id: string) {
    const response = await axios.delete(`${URL}/products/${id}`);
    return response;
  }
}

const apiAdapter = new ApiAdapter();
export default apiAdapter;
