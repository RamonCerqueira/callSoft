/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
  tenantId: string;
}

/**
 * Login Response
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  tenantId: string;
  roleIds?: string[];
}

/**
 * User
 * Represents an authenticated user
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt?: string;
  tenantId?: string;
}

/**
 * Password Reset Request
 */
export interface PasswordResetRequestRequest {
  email: string;
  tenantId: string;
}

/**
 * Password Reset Confirm
 */
export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}
