// /src/types/authTypes.ts

export interface LoginCredentials {
  email: string;
  password: string;
  clientType: 'web';
  keepLoggedIn: boolean;
}

export class AuthError extends Error {
  constructor(
    message: string, 
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class TokenError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = 'TokenError';
  }
}

export class LoginError extends AuthError {
  constructor(message: string, status: number) {
    super(message, status);
    this.name = 'LoginError';
  }
}