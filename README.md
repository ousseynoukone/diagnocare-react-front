# 🩺 Diagnocare – React Frontend Client

A responsive, high-performance web interface built for the Diagnocare Healthcare platform.

---

## 🛠️ Technology Stack

* **Core Framework:** React 19 (Functional Components, Hooks)
* **Build System:** Vite (Fast Refresh / HMR)
* **Language:** TypeScript (Type-safe models and API integration)
* **Styling:** Tailwind CSS v4 (Modern utility-first styling) & Vanilla CSS overrides
* **Icons:** Lucide React
* **State Management:** Zustand (Persisted stores)
* **Data Fetching:** TanStack React Query (Automatic caching and mutation state)
* **Form Handling:** React Hook Form
* **HTTP Client:** Axios (With interceptors and credentials support)

---

## 🔐 Cookie-Based Authentication Integration

To guard against Cross-Site Scripting (XSS) tokens are not stored in local storage or read by JavaScript. Instead, the application relies entirely on secure **HttpOnly cookies** issued by the backend gateway.

### Key Implementation Details:

1. **Axios Client Configuration (`AxiosApiClient.tsx`):**
   * The global `apiClient` instance has `withCredentials: true` enabled.
   * This forces the browser to automatically attach local cookies (such as `token` and `refreshToken`) to outgoing API requests and save new cookies sent by `Set-Cookie` response headers.

2. **State Management (`UserStore.ts`):**
   * Local storage is only used to persist user profile metadata (e.g. name, email, roles) in the `diagnocare-user` store for rendering UI elements.
   * Authentication secrets (JWTs) remain hidden from JavaScript.
   * Triggering `logout()` sends a request to the backend `/auth/logout` endpoint which prompts the browser to clear the HttpOnly cookies, and then resets local UI states.

3. **Interceptor Refresh Mechanism:**
   * If an API request fails with a `401 Unauthorized` status (due to an expired access token), the interceptor catches it.
   * It attempts to hit `/auth/refresh-token` in the background (which succeeds if the long-lived `refreshToken` cookie is valid).
   * Once refreshed, it automatically retries the failed request, preventing session disruption.

---

## ⚙️ Running Locally

### 🐳 Prerequisites
Ensure you have Node.js (v18+) and npm installed.

### 🚀 Get Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8765/api/v1
   ```

3. Spin up the Vite development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
