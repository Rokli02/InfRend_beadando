import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { MonthlyReport } from '../models/MonthlyReport';
import { SaveTravel, Travel } from '../models/Travel';

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private url: string = 'http://localhost:3000/api/travel';
  constructor(private http: HttpClient) {}

  getTravels() {
    return lastValueFrom(this.http.get<Travel[]>(this.url));
  }

  saveTravel(travel: Travel) {
    const travelForSave : SaveTravel= {
      from: travel.from,
      to: travel.to,
      purpose: travel.purpose,
      startDate: travel.startDate,
      travelledDistance: travel.travelledDistance,
      newMileage: travel.newMileage,
      carId: travel.car.id,
      driverId: travel.driver.id
    };
    return lastValueFrom(this.http.post(this.url, travelForSave));
  }

  updateTravel(id: number, travel: SaveTravel) {/*
    const travelForSave : SaveTravel= {
      from: travel.from ? travel.from : undefined,
      to: travel.to ? travel.to : undefined,
      purpose: travel.purpose ? travel.purpose : undefined,
      startDate: travel.startDate ? travel.startDate : undefined,
      travelledDistance: travel.travelledDistance ? travel.travelledDistance : undefined,
      newMileage: travel.newMileage ? travel.newMileage : undefined,
      carId: travel.car.id ? travel.car.id : undefined,
      driverId: travel.driver.id ? travel.driver.id : undefined,
    };*/
    return lastValueFrom(this.http.patch(`${this.url}/${id}`,travel));
  }

  deleteTravel(id: number) {
    return lastValueFrom(this.http.delete(`${this.url}/${id}`));
  }

  getMonthlyReport(licensePlate: string, year: number, month: number) {
    return lastValueFrom(this.http.get<MonthlyReport>(`${this.url}/report`,{
      params: {
        licensePlate: licensePlate,
        year: year,
        month: month
      }
    }))
  }
}
