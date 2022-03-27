import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Driver } from '../models/Driver';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private url: string = 'http://localhost:3000/api/driver';
  constructor(private http: HttpClient) {}

  getDrivers() {
    return lastValueFrom(this.http.get<Driver[]>(this.url));
  }

  getDriversLicenseNotExpired(expirationDate: Date | string) {
    const expDate = this.transformDateToAcceptable(expirationDate);

    return lastValueFrom(this.http.get<Driver[]>(`${this.url}/notexpired`, {
      params: {
        expDate: expDate
      }
    }));
  }

  saveDriver(driver: Driver) {
    return lastValueFrom(this.http.post(this.url, driver));
  }

  updateDriver(id: number, driver: Driver) {
    return lastValueFrom(this.http.put(`${this.url}/${id}`,driver));
  }

  deleteDriver(id: number) {
    return lastValueFrom(this.http.delete(`${this.url}/${id}`));
  }

  private transformDateToAcceptable(paramDate: string | Date) : string {
    const preDate : Date = new Date(paramDate);

    return `${preDate.getFullYear()}-${preDate.getMonth()+1}-${preDate.getDate()}`;
  }
}
