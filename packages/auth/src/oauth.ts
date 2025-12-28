// OAuth-ready structure for future Google/Apple OAuth integration

export interface OAuthProvider {
  id: string;
  name: string;
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type: string;
}

export interface OAuthUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

// Placeholder for OAuth providers
export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  APPLE: 'apple',
} as const;

export type OAuthProviderType = (typeof OAUTH_PROVIDERS)[keyof typeof OAUTH_PROVIDERS];

// These functions will be implemented when OAuth is added
export async function getOAuthUrl(provider: OAuthProviderType): Promise<string> {
  throw new Error('OAuth not implemented yet');
}

export async function exchangeOAuthCode(
  provider: OAuthProviderType,
  code: string
): Promise<OAuthTokenResponse> {
  throw new Error('OAuth not implemented yet');
}

export async function getOAuthUserInfo(
  provider: OAuthProviderType,
  accessToken: string
): Promise<OAuthUserInfo> {
  throw new Error('OAuth not implemented yet');
}

