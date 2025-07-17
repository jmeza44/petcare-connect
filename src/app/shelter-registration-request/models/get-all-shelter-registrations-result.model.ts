import { ShelterRequestStatus } from './get-all-shelter-registrations-query.model';

export interface GetAllShelterRegistrationsResult {
  id: string;
  shelterName: string;
  email: string;
  cellphoneNumber: string;
  status: ShelterRequestStatus;
  createdAt: string; // ISO string
  reviewedAt?: string;
  reviewedBy?: string;
  city: string;
  department: string;
  submittedBy?: string;
}
