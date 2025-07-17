import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SubmitShelterRegistration } from '../models/submit-shelter-registration-request.model';

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
}
