import axios from 'axios';

class ApiClient {
  constructor(remoteHostUrl) {
    this.remoteHostUrl = remoteHostUrl;
    this.tokenName = 'rate_my_setup_token';
    this.token = localStorage.getItem(this.tokenName) || null; // Retrieve token from localStorage
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem(this.tokenName, token);
  }

  getToken() {
    return this.token;
  }

  async request({ endpoint, method = 'GET', data = {} }) {
    const url = `${this.remoteHostUrl}/${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await axios({ url, method, data, headers });
      return { data: res.data, error: null };
    } catch (error) {
      console.error({ errorResponse: error.response });
      const message = error?.response?.data?.message;
      return { data: null, error: message || String(error) };
    }
  }

  async createRatingForPost({ postId, rating }) {
    return await this.request({
      endpoint: `posts/${postId}/ratings`,
      method: 'POST',
      data: { rating },
    });
  }

  async updatePost(postId, postUpdate) {
    return await this.request({
      endpoint: `posts/${postId}`,
      method: 'PATCH',
      data: postUpdate,
    });
  }

  async fetchPostById(postId) {
    return await this.request({
      endpoint: `posts/${postId}`,
      method: 'GET',
    });
  }

  async listPosts() {
    return await this.request({ endpoint: 'posts', method: 'GET' });
  }

  async createPost(post) {
    return await this.request({
      endpoint: 'posts',
      method: 'POST',
      data: post,
    });
  }

  async fetchUserFromToken() {
    return await this.request({ endpoint: 'auth/me', method: 'GET' });
  }

  async loginUser(credentials) {
    return await this.request({
      endpoint: 'auth/login',
      method: 'POST',
      data: credentials,
    });
  }

  async signupUser(credentials) {
    return await this.request({
      endpoint: 'auth/register',
      method: 'POST',
      data: credentials,
    });
  }

  async getPosts() {
    return await this.request({
      endpoint: 'posts',
      method: 'GET',
    });
  }

  async logoutUser() {
    this.setToken(null);
    localStorage.removeItem(this.tokenName); // Ensure the token is removed
  }
}

export default new ApiClient(
  process.env.REACT_APP_REMOTE_HOST_URL || 'http://localhost:3001'
);
