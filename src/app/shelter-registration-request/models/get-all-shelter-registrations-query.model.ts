export type ShelterRequestStatus =
  | 'Pending'
  | 'Withdrawn'
  | 'Approved'
  | 'Rejected';
export type ShelterRequestSortBy =
  | 'createdAt'
  | 'status'
  | 'shelterName'
  | 'reviewedAt'
export type ShelterRequestSortDirection = 'asc' | 'desc';

export interface GetAllShelterRegistrationsQuery {
  // Filtering
  status?: ShelterRequestStatus;
  city?: string;
  department?: string;
  submittedFrom?: string; // ISO date string
  submittedTo?: string; // ISO date string
  reviewed?: boolean;
  search?: string;
  // Pagination
  page?: number;
  pageSize?: number;
  // Sorting
  sortBy?: ShelterRequestSortBy;
  sortDirection?: ShelterRequestSortDirection;
}
