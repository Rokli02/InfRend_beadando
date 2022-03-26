import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Driver } from '../models/Driver';
import { DriverService } from '../services/driver.service';
import { AddDriverComponent } from './add-driver/add-driver.component';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit, OnDestroy {
  private dialogSub !: Subscription;
  drivers: Driver[] = [];
  text: string = "There are no drivers in the database!";

  constructor(private dialog: MatDialog,
              private driverService: DriverService) {}

  ngOnDestroy(): void {
    if(this.dialogSub){
      this.dialogSub.unsubscribe();
    }
  }

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

    this.dialogSub = dialogRef.afterClosed().subscribe(async (value) => {
      if(value === null || value === undefined){
        console.log("CLOSED");
      }
      else {
        console.log("ADDED");
        if(!this.drivers.find((driver) => driver.driverLicense === value.driverLicense)){
          try {
            await this.driverService.saveDriver(value);
            this.drivers.push(value);
          }catch(err) {
            console.log("Couldn't save driver:\n"+err);
          }
        } else {
          alert('Driver with such driver license already exists!');
        }
      }
      console.log(value);
    });
  }

  async editDriver(driverWrap: {id: number, driver: Driver}) {
    let index : number = -1;
    for(let i = 0; i < this.drivers.length; i++) {
      if(this.drivers[i].id === driverWrap.id) {
        index = i;
        break;
      }
    }

    if(index !== -1){
      try {
        await this.driverService.updateDriver(driverWrap.id, driverWrap.driver);
        this.drivers[index] = {
          id: driverWrap.id,
          name: driverWrap.driver.name,
          birthdate: driverWrap.driver.birthdate,
          address: driverWrap.driver.address,
          driverLicense: driverWrap.driver.driverLicense,
          driverLicenseExpiration: driverWrap.driver.driverLicenseExpiration
        }
      }catch(err) {
        console.log("Couldn't edit driver:\n"+err);
      }
      return;
    }

    alert('Edited driver doesn\'t exists in the list!');
  }

  async deleteDriver(id: number) {
    let index : number = -1;
    for(let i = 0; i < this.drivers.length; i++) {
      if(this.drivers[i].id === id) {
        index = i;
        break;
      }
    }

    if(index !== 1) {
      try {
        await this.driverService.deleteDriver(id);
        this.drivers.splice(index, 1);
      }catch(err) {
        console.log("Couldn't delete driver:\n"+err);
      }
      return;
    }

    alert("Couldn't delete driver, because it isn't on the list!");
  }
}
