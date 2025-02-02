import { ClerkJWTClaims } from '@clerk/types';

import { AuthErrorReason } from './errors';

export enum AuthStatus {
  SignedIn = 'Signed in',
  SignedOut = 'Signed out',
  Interstitial = 'Interstitial',
}

type Session = {
  id?: string;
  userId?: string;
};

export type VerifySessionTokenOptions = {
  authorizedParties?: string[];
  jwtKey?: string;
};

export type BuildAuthenticatedStateOptions = {
  jwtKey?: string;
  authorizedParties?: string[];
  fetchInterstitial: () => Promise<string> | null;
  tokenType: TokenType;
};

export type TokenType = 'cookie' | 'header';

export type AuthState = {
  status: AuthStatus;
  session?: Session;
  /* Interstitial is returned as null when the interstitial endpoint will be rewritten to instead of being rendered directly */
  interstitial?: string | null;
  sessionClaims?: ClerkJWTClaims;
  /* Error reason for signed-out and interstitial states. Would probably be set on the `Auth-Result` response header. */
  errorReason?: AuthErrorReason;
};

export type AuthStateParams = {
  /* Client token cookie value */
  cookieToken?: string;
  /* Client uat cookie value */
  clientUat?: string;
  /* Client token header value */
  headerToken?: string | null;
  /* Request origin header value */
  origin?: string | null;
  /* Request host header value */
  host: string;
  /* Request forwarded host value */
  forwardedHost?: string | null;
  /* Request forwarded port value */
  forwardedPort?: string | null;
  /* Request forwarded proto value */
  forwardedProto?: string | null;
  /* Request referrer */
  referrer?: string | null;
  /* Request user-agent value */
  userAgent?: string | null;
  /* A list of authorized parties to validate against the session token azp claim */
  authorizedParties?: string[];
  /*
   * HTTP utility for fetching a text/html string.
   * If explicitly `null` it will only return the status for the client to handle as it may
   */
  fetchInterstitial: () => Promise<string> | null;
  /* Value corresponding to the JWT verification key */
  jwtKey?: string;
};
