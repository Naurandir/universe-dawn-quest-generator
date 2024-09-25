import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServiceService {

  constructor() { }

  // Set a value in local storage
  setItem(component: string, key: string, value: string): void {
    localStorage.setItem(component + "-" + key, value);
  }

  // Get a value from local storage
  getItem(component: string, key: string): string | null {
    return localStorage.getItem(component + "-" + key);
  }

  // Remove a value from local storage
  removeItem(component: string, key: string): void {
    localStorage.removeItem(component + "-" + key);
  }

  // Clear all items from local storage
  clear(): void {
    localStorage.clear();
  }
}
