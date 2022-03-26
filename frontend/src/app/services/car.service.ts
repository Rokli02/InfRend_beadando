import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Car } from '../models/Car';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private url: string = 'http://localhost:3000/car';
  constructor(private http: HttpClient) {}

  getCars() {
    return lastValueFrom(this.http.get<Car[]>(this.url));
  }

  saveCar(car: Car) {
    return lastValueFrom(this.http.post(`${this.url}`,car));
  }

  updateCar(id: number, car: Car){
    return lastValueFrom(this.http.put(`${this.url}/${id}`,car));
  }

  deleteCar(id: number) {
    return lastValueFrom(this.http.delete(`${this.url}/${id}`));
  }
}
