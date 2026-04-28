export enum UserRole {
  CUSTOMER = 'customer',
  RESTAURANT_OWNER = 'restaurant_owner',
  DELIVERY_DRIVER = 'delivery_driver',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export interface UserPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  nom?: string;
  prenom?: string;
  phone?: string;
  quartier?: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}
