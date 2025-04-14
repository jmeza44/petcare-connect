import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly prefix = 'petcare_connect_';

  setItem(key: string, value: string | null | undefined): void {
    try {
      if (value === undefined || value === null) {
        localStorage.removeItem(`${this.prefix}${key}`);
      } else {
        localStorage.setItem(`${this.prefix}${key}`, value);
      }
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  }

  getItem(key: string): string | null {
    try {
      const value = localStorage.getItem(`${this.prefix}${key}`);
      return value;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  }
}
