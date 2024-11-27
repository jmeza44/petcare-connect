import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs, orderBy, query, where } from '@angular/fire/firestore';
import { Observable, catchError, forkJoin, from, map, of, switchMap, tap } from 'rxjs';
import { Permission } from '../../models/permissions/permission.model';
import { ProgramGroup } from '../../models/permissions/program-group.model';
import { Program } from '../../models/permissions/program.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private firestore: Firestore) {}

  /**
   * Fetches menu content for a specific role, grouping programs by programGroup.
   * @param role - The role for which to fetch accessible programs.
   * @returns Observable with grouped programs or an empty object on error.
   */
  getMenuContent(role: string): Observable<{ [programGroupId: string]: { programGroup: ProgramGroup; programs: Program[]; }; }> {
    return this.fetchPermissions(role).pipe(
      switchMap((permissions) => {
        const programIds = permissions.map((perm) => perm.programId);
        return forkJoin({
          programs: this.fetchPrograms(programIds),
          programGroups: this.fetchProgramGroupsFromPrograms(programIds),
        });
      }),
      map(({ programs, programGroups }) => {
        const grouped = programGroups.reduce((result, programGroup) => {
          result[programGroup.id] = {
            programGroup,
            programs: programs
              .filter((prog) => prog.programGroupId === programGroup.id)
              .sort((a, b) => a.order - b.order),
          };
          return result;
        }, {} as { [programGroupId: string]: { programGroup: ProgramGroup; programs: Program[]; }; });

        return grouped;
      }),
      catchError((error) => {
        console.error('Error fetching menu content:', error);
        return of({});
      })
    );
  }

  /**
   * Fetches all programs that a role has permission to access.
   * @param role - The role for which to fetch accessible programs.
   * @returns Observable with programs that the role has permission to access.
   */
  getProgramsByRole(role: string): Observable<Program[]> {
    return this.fetchPermissions(role).pipe(
      map((permissions) => permissions.map((perm) => perm.programId)),
      switchMap((programIds) => this.fetchPrograms(programIds)),
      catchError((error) => {
        console.error('Error fetching programs by role:', error);
        return of([]);
      })
    );
  }

  private fetchPermissions(role: string): Observable<Permission[]> {
    const permissionsRef = collection(this.firestore, 'permissions');
    const q = query(permissionsRef, where('role', '==', role));
    return from(getDocs(q))
      .pipe(map((querySnapshot) =>
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Permission))
      ),
        catchError((error) => {
          console.error('Error fetching permissions:', error);
          return of([]);
        })
      );
  }

  private fetchPrograms(programIds: string[]): Observable<Program[]> {
    if (programIds.length === 0) return of([]);

    const programsRef = collection(this.firestore, 'programs');
    const q = query(programsRef, where('__name__', 'in', programIds)); // Use __name__ to query document IDs
    return from(getDocs(q)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Program))
      ),
      catchError((error) => {
        console.error('Error fetching programs:', error);
        return of([]);
      })
    );
  }


  private fetchProgramGroupsFromPrograms(programIds: string[]): Observable<ProgramGroup[]> {
    return this.fetchPrograms(programIds).pipe(
      map((programs) => [...new Set(programs.map((prog) => prog.programGroupId))]),
      switchMap((programGroupIds) => {
        return this.fetchProgramGroups(programGroupIds);
      }),
      catchError((error) => {
        console.error('Error fetching program groups from programs:', error);
        return of([]);
      })
    );
  }


  private fetchProgramGroups(programGroupIds: string[]): Observable<ProgramGroup[]> {
    if (programGroupIds.length === 0) return of([]);

    const programGroupsRef = collection(this.firestore, 'programGroups');
    const q = query(programGroupsRef, where('__name__', 'in', programGroupIds), orderBy('order'));
    return from(getDocs(q)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as ProgramGroup))
      ),
      catchError((error) => {
        console.error('Error fetching program groups:', error);
        return of([]);
      })
    );
  }
}
