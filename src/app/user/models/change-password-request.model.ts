export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  clientBaseUrl?: string;
}
