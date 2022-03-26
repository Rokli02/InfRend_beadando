import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Car } from '../models/Car';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  text: string = "There are no cars in the database";

  constructor(private dialog: MatDialog,
              private carService: CarService) { }

  async ngOnInit() {
    try {
      this.cars = await this.carService.getCars();
    }catch(err) {
      this.text = "Some problem occurred during loading!";
    }
  }

  addCar() {

  }
}
