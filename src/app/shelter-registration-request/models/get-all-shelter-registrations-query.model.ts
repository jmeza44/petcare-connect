export type ShelterRequestStatus =
  | 'Pending'
  | 'Withdrawn'
  | 'Approved'
  | 'Rejected';

export interface GetAllShelterRegistrationsQuery {
  status?: ShelterRequestStatus;
  city?: string;
  department?: string;
  submittedFrom?: string; // ISO date string
  submittedTo?: string; // ISO date string
  reviewed?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}
