import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosInstance } from "axios";
import { API_TIMEOUT, API_URL } from "../config/env";

/**
 * Axios instance for API calls
 *
 * Features:
 * - Auto-configured BASE_URL based on platform
 * - Request timeout
 * - JWT token attachment via interceptor
 * - Error logging for debugging
 */

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Automatically attaches JWT token to all requests
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("❌ Error retrieving token from AsyncStorage:", error);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request config error:", error);
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * Handles errors and logs them for debugging
 */
api.interceptors.response.use(
  (response) => {
    // Success response - no modification needed
    return response;
  },
  (error: AxiosError) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      console.error("\n❌ API ERROR (Server Responded):");
      console.error(`   Status: ${error.response.status}`);
      console.error(`   URL: ${error.config?.url}`);
      console.error(`   Method: ${error.config?.method?.toUpperCase()}`);
      console.error("   Response:", JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // Request made but no response received (Network error)
      console.error("\n❌ NETWORK ERROR (No Response from Server):");
      console.error(`   URL: ${error.config?.url}`);
      console.error(`   Method: ${error.config?.method?.toUpperCase()}`);
      console.error("   Message:", error.message);
      console.error("\n🔧 TROUBLESHOOTING:");
      console.error("   1. ✅ Is backend running?");
      console.error("      Check: npm run server (in backend folder)");
      console.error("   2. ✅ Correct IP address?");
      console.error("      Run: ipconfig (Windows) or ifconfig (Mac/Linux)");
      console.error("      Update LOCAL_IP in src/config/api.ts if needed");
      console.error("   3. ✅ Same WiFi network?");
      console.error("      Device must be on same network as backend");
      console.error("   4. ✅ Backend port correct?");
      console.error("      Ensure it's running on port 5000");
      console.error("   5. ✅ Firewall blocking?");
      console.error("      Check Windows Firewall allows port 5000");
    } else {
      // Error in request setup
      console.error("\n❌ REQUEST ERROR:");
      console.error("   Message:", error.message);
      console.error("   Config:", error.config);
    }
    return Promise.reject(error);
  },
);

export default api;
