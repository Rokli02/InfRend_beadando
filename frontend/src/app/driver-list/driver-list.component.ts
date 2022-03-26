import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Driver } from '../models/Driver';
import { DriverService } from '../services/driver.service';
import { AddDriverComponent } from './add-driver/add-driver.component';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
  drivers: Driver[] = [{id: 1, name: "Markika", birthdate: '2000-10-19', address: 'Sehol', driverLicense: 'NEMJO', driverLicenseExpiration: '2022-04-03'}];
  text: string = "There are no drivers in the database!";
  constructor(private dialog: MatDialog,
              private driverService: DriverService) { }

  async ngOnInit() {
    try {
      this.drivers = await this.driverService.getDrivers();
    }catch(err) {
      this.text = "Some problem occurred during loading!";
    }
  }

  addDriver() {
    const dialogRef = this.dialog.open(AddDriverComponent, {
      width: '35%',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((value) => {
      if(value === null || value === undefined){
        console.log("CLOSED");
      }
      else {
        console.log("ADDED");
        this.drivers.push(value);
      }
      console.log(value);
    });
  }
}
