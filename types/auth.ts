export interface AuthData {
    username: string;
    // Dodavati jos po potrebi
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    success: boolean;
    message?: string;
  }