import axios from "axios";

export default class ApiService {
  static BASE_URL = "http://localhost:8080";

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // ---------------- AUTH APIs ----------------

  static async registerUser(registration) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/register`,
      registration
    );
    return response.data;
  }

  static async loginUser(loginDetails) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/login`,
      loginDetails
    );
    return response.data;
  }

  static async getLoggedInUserInfo() {
    const response = await axios.get(`${this.BASE_URL}/user/my-info`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  // ---------------- CART APIs ----------------

  static async getMyCart() {
    const response = await axios.get(`${this.BASE_URL}/cart/my`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async addToCart(productId) {
    const response = await axios.post(
      `${this.BASE_URL}/cart/add/${productId}`,
      {},
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async incrementCartItem(productId) {
    const response = await axios.put(
      `${this.BASE_URL}/cart/increment/${productId}`,
      {},
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async decrementCartItem(productId) {
    const response = await axios.put(
      `${this.BASE_URL}/cart/decrement/${productId}`,
      {},
      { headers: this.getHeader() }
    );
    return response.data;
  }

  // ---------------- PRODUCT APIs ----------------

  static async addProduct(formData) {
    const response = await axios.post(
      `${this.BASE_URL}/product/create`,
      formData,
      {
        headers: {
          ...this.getHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  static async updateProduct(formData) {
    const response = await axios.put(
      `${this.BASE_URL}/product/update`,
      formData,
      {
        headers: {
          ...this.getHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  static async getAllProducts() {
    const response = await axios.get(`${this.BASE_URL}/product/get-all`);
    return response.data;
  }

  static async searchProducts(searchValue) {
    const response = await axios.get(`${this.BASE_URL}/product/search`, {
      params: { searchValue },
    });
    return response.data;
  }

  static async getAllProductsByCategoryId(categoryId) {
    const response = await axios.get(
      `${this.BASE_URL}/product/get-by-category-id/${categoryId}`
    );
    return response.data;
  }

  static async getProductById(productId) {
    const response = await axios.get(
      `${this.BASE_URL}/product/get-by-product-id/${productId}`
    );
    return response.data;
  }

  static async deleteProduct(productId) {
    const response = await axios.delete(
      `${this.BASE_URL}/product/delete/${productId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // ---------------- CATEGORY APIs ----------------

  static async createCategory(body) {
    const response = await axios.post(
      `${this.BASE_URL}/category/create`,
      body,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllCategory() {
    const response = await axios.get(`${this.BASE_URL}/category/get-all`);
    return response.data;
  }

  static async updateCategory(categoryId, body) {
    const response = await axios.put(
      `${this.BASE_URL}/category/update/${categoryId}`,
      body,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteCategory(categoryId) {
    const response = await axios.delete(
      `${this.BASE_URL}/category/delete/${categoryId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // ---------------- ORDER APIs ----------------

  static async createOrder(orderRequest) {
    const response = await axios.post(
      `${this.BASE_URL}/order/create`,
      orderRequest,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async getAllOrders(page = 0, size = 1000) {
    const response = await axios.get(
      `${this.BASE_URL}/order/filter?page=${page}&size=${size}`,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async getOrderById(id) {
    return axios.get(`${this.BASE_URL}/order/item/${id}`, {
      headers: this.getHeader(),
    });
  }

  static async updateOrderStatus(orderItemId, status) {
    const response = await axios.put(
      `${this.BASE_URL}/order/update-item-status/${orderItemId}?status=${status}`,
      {},
      { headers: this.getHeader() }
    );
    return response.data;
  }

  // ---------------- PAYMENT APIs ----------------

  static async createPaymentOrder(orderId) {
    const response = await axios.post(
      `${this.BASE_URL}/payment/create-order/${orderId}`,
      {},
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async verifyPayment(body) {
    const response = await axios.post(`${this.BASE_URL}/payment/verify`, body, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  // ---------------- ADDRESS APIs ----------------

  static async saveAddress(address) {
    const response = await axios.post(
      `${this.BASE_URL}/user/save-address`,
      address,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateAddress(address) {
    const response = await axios.put(
      `${this.BASE_URL}/user/update-address`,
      address,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // ---------------- AUTH CHECK HELPERS ----------------

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  static isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  static isAdmin() {
    return localStorage.getItem("role") === "ADMIN";
  }

  // ---------------- ORDER TRACKING APIs ----------------

  static async getOrderTimeline(orderId) {
    const response = await axios.get(
      `${this.BASE_URL}/order/${orderId}/timeline`,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  // ---------------- NOTIFICATION APIs ----------------

  static async getUserNotifications(userId) {
    const response = await axios.get(
      `${this.BASE_URL}/notifications/user/${userId}`,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async markNotificationAsRead(id) {
    const response = await axios.post(
      `${this.BASE_URL}/notifications/${id}/read`,
      {},
      { headers: this.getHeader() }
    );
    return response.data;
  }

  // ---------------- REVIEW APIs ----------------

  static async getReviewsByProduct(productId) {
    const response = await axios.get(
      `${this.BASE_URL}/reviews/product/${productId}`,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async addReview(reviewData) {
    const response = await axios.post(
      `${this.BASE_URL}/reviews/add`,
      reviewData,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async updateReview(reviewId, reviewData) {
    const response = await axios.put(
      `${this.BASE_URL}/reviews/update/${reviewId}`,
      reviewData,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async deleteReview(reviewId) {
    const response = await axios.delete(
      `${this.BASE_URL}/reviews/delete/${reviewId}`,
      { headers: this.getHeader() }
    );
    return response.data;
  }
  // ---------------- WISHLIST APIs ----------------

  static async addToWishlist(productId) {
    const response = await axios.post(
      `${this.BASE_URL}/wishlist/add/${productId}`,
      {},
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async removeFromWishlist(productId) {
    const response = await axios.delete(
      `${this.BASE_URL}/wishlist/remove/${productId}`,
      { headers: this.getHeader() }
    );
    return response.data;
  }

  static async getWishlist() {
    const response = await axios.get(`${this.BASE_URL}/wishlist/my`, {
      headers: this.getHeader(),
    });
    return response.data;
  }
}
