import axios from 'axios';
import { useUserStore } from '../store/UserStore';


const apiBaseUrl = import.meta.env.REACT_APP_API_BASE_URL  || 'http://localhost:8765/api/v1';


export const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

// ─── Request interceptor: attach JWT token ───────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response interceptor: auto-refresh on 401 ──────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

/**
 * Process queued requests that were waiting for the token refresh.
 */
function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
}

/**
 * Clear all auth data and redirect to login.
 */
function forceLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  useUserStore.getState().clearUser();
  // Redirect to login — only if not already there to avoid loops
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login';
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 (Unauthorized) errors
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't intercept auth endpoints — avoid infinite loops
    const url = originalRequest.url || '';
    if (url.includes('/auth/login') || url.includes('/auth/refresh-token') || url.includes('/auth/register')) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refreshToken');

    // No refresh token available — force logout
    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            originalRequest.headers.authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    // Mark as refreshing and attempt token renewal
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${apiBaseUrl}/auth/refresh-token`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const payload = response.data.data ?? response.data;
      const newToken = payload.token;
      const newRefreshToken = payload.refreshToken;

      if (!newToken) {
        throw new Error('No token in refresh response');
      }

      // Store new tokens
      localStorage.setItem('token', newToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      // Retry all queued requests with the new token
      processQueue(null, newToken);

      // Retry the original request
      originalRequest.headers.authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed — force logout
      processQueue(refreshError, null);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
