import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResult } from '../../shared/models/paginated-result.model';
import { SubmitShelterRegistration } from '../models/submit-shelter-registration-request.model';
import { GetAllShelterRegistrationsQuery } from '../models/get-all-shelter-registrations-query.model';
import { GetAllShelterRegistrationsResult } from '../models/get-all-shelter-registrations-result.model';
import { ShelterRegistrationRequestDetailsDto } from '../models/shelter-registration-request-details-dto.model';

@Injectable({ providedIn: 'root' })
export class ShelterRegistrationRequestService {
  private baseUrl = `${environment.apiBaseUrl}/ShelterRegistrationRequest`;

  constructor(private httpClient: HttpClient) {}

  submitRegistration(
    data: SubmitShelterRegistration,
  ): Observable<{ shelterRegistrationRequestId: string }> {
    return this.httpClient.post<{ shelterRegistrationRequestId: string }>(
      `${this.baseUrl}`,
      data,
    );
  }

  getAllRegistrations(
    query: GetAllShelterRegistrationsQuery,
  ): Observable<PaginatedResult<GetAllShelterRegistrationsResult>> {
    return this.httpClient.get<
      PaginatedResult<GetAllShelterRegistrationsResult>
    >(`${this.baseUrl}`, { params: this.toHttpParams(query) });
  }

  getMyRegistration(): Observable<ShelterRegistrationRequestDetailsDto> {
    return this.httpClient.get<ShelterRegistrationRequestDetailsDto>(
      `${this.baseUrl}/my`,
    );
  }

  getRegistrationById(
    id: string,
  ): Observable<ShelterRegistrationRequestDetailsDto> {
    return this.httpClient.get<ShelterRegistrationRequestDetailsDto>(
      `${this.baseUrl}/${id}`,
    );
  }

  private toHttpParams(
    query: GetAllShelterRegistrationsQuery,
  ): Record<string, string> {
    const params: Record<string, string> = {};
    Object.entries(query).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== 'undefined' &&
        value !== 'null'
      ) {
        params[key] = value.toString();
      }
    });
    return params;
  }
}
