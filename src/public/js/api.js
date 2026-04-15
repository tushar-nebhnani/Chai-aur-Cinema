const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const API_BASE_URL = isLocalhost
  ? "http://localhost:4000/bookmyshow"
  : "https://your-deployed-backend.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending cookies
  headers: {
    "Content-Type": "application/json",
  },
});

window.api = {
  // Authentication
  register: async (data) => await apiClient.post("/register", data),
  login: async (data) => await apiClient.post("/login", data),
  logout: async () => await apiClient.post("/logout"),
  changePassword: async (data) => await apiClient.put("/change-password", data),
  resetPassword: async (token, newPassword) =>
    await apiClient.put(`/reset-password?token=${token}`, { newPassword }),
  deleteAccount: async () => await apiClient.delete("/delete-account"),

  // Business Logic
  bookSeats: async (data) => await apiClient.post("/book-seats", data),
  getSeats: async (showId) => await apiClient.get(`/seats?showId=${showId}`),
};
