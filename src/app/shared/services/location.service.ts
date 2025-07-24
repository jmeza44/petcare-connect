import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectOption } from '../types/select-option.type';
import { Department } from '../models/department.model';
import { Municipality } from '../models/municipality.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private http = inject(HttpClient);

  getDepartments(): Observable<SelectOption<number>[]> {
    return this.departments$.pipe(
      map((depts) =>
        depts.map((d) => ({
          label: d.name,
          value: d.id,
        })),
      ),
    );
  }

  getMunicipalitiesByDepartmentId(
    departmentId?: number,
  ): Observable<SelectOption<number>[]> {
    if (departmentId === undefined || departmentId === null) {
      return this.municipalities$.pipe(
        map((munis) =>
          munis.map((m) => ({
            label: m.name,
            value: m.id,
          })),
        ),
      );
    }

    const result = this.municipalities$.pipe(
      map((munis) =>
        munis
          .filter((m) => m.departmentId == departmentId)
          .map((m) => ({
            label: m.name,
            value: m.id,
          })),
      ),
    );

    return result;
  }

  getDepartmentNameById(id?: number | null): Observable<string | undefined> {
    if (id === undefined || id === null) return of(undefined);
    return this.departments$.pipe(
      map((depts) => depts.find((d) => d.id == id)?.name),
    );
  }

  getMunicipalityNameById(id?: number | null): Observable<string | undefined> {
    if (id === undefined || id === null) return of(undefined);
    return this.municipalities$.pipe(
      map((munis) => munis.find((m) => m.id == id)?.name),
    );
  }

  private departments$ = this.http
    .get<{ data: Department[] }>('assets/location/departments.json')
    .pipe(
      map((res) => res.data),
      shareReplay(1),
    );

  private municipalities$ = this.http
    .get<{ data: Municipality[] }>('assets/location/municipalities.json')
    .pipe(
      map((res) => res.data),
      shareReplay(1),
    );
}
