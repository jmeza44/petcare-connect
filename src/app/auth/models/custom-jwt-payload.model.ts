import { JwtPayload } from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
  sub?: string; // Standard subject claim (user ID)
  nameid?: string; // ASP.NET Core Identity often uses this
  userId?: string; // Custom user ID claim
  // Microsoft Identity claims with full URIs
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  security_stamp?: string;
}
