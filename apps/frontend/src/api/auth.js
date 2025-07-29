// src/api/auth.js
export async function loginUser(credentials) {
    // Replace with actual API call
    if (credentials.email === "test@example.com" && credentials.password === "password") {
      const fakeToken = "mock-jwt-token";
      localStorage.setItem("token", fakeToken);
      return { success: true, token: fakeToken };
    }
    return { success: false };
  }
  
  export async function signupUser(userData) {
    // Mock signup
    return { success: true };
  }
  
  export function logoutUser() {
    localStorage.removeItem("token");
  }
  
  export function isAuthenticated() {
    return !!localStorage.getItem("token");
  }
  