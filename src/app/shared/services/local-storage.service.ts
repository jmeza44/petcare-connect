import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly prefix = 'petcare_connect_';

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(`${this.prefix}${key}`, value);
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  }

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(`${this.prefix}${key}`);
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
