import axios from 'axios';

class ApiClient {
  constructor(remoteHostUrl) {
    this.remoteHostUrl = remoteHostUrl;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request({ endpoint, method = 'GET', data = {} }) {
    const url = `${this.remoteHostUrl}/${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`; // Fixed the header assignment
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

  async createPost(post) {
    return await this.request({
      endpoint: 'posts',
      method: 'POST',
      data: post,
    });
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
}

export default new ApiClient(
  process.env.REACT_APP_REMOTE_HOST_URL || 'http://localhost:3001'
);
