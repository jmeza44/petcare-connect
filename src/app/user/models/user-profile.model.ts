export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
}

export interface UserDisplayInfo {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role?: string;
}
