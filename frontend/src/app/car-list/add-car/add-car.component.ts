import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Car } from 'src/app/models/Car';
import { Fuel } from 'src/app/models/Car';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit, OnDestroy {
  carForm !: FormGroup;
  editMode : boolean = false;
  title : string = "Add a new car";
  handleButton : string = "Add";
  fuels : string[] = [];

  constructor(private fb: FormBuilder/*,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: Car*/) { }

    //unsubscribe from every observable
    ngOnDestroy(): void {

    }

  ngOnInit(): void {/*
    if(this.data){
      this.editMode = true;
      this.title = "Edit car";
      this.handleButton = "Edit";
    }*/
    this.fuels = this.fillFuels()

    this.carForm = this.fb.group({
      licensePlate: ['', [Validators.required, Validators.pattern(/[epvz]-[\d]{5}$|[a-zA-Z]{3}-[\d]{3}$|[a-zA-Z]{4}-[\d]{2}$|[a-zA-Z]{5}-[\d]{1}$|[mM][\d]{2} [\d]{4}$|(ck|dt|hc|cd|hx|ma|ot|rx|rr) [\d]{2}-[\d]{2}$|(c-x|x-a|x-b|x-c) [\d]{4}$/)]],
      type: ['', [Validators.required]],
      fuel: ['', [Validators.required]],
      consumption: ['', [Validators.required, Validators.min(0)]],
      mileage: ['', [Validators.required, Validators.min(0)]]
    });
  }

  handleCar() {
    if(this.editMode){
      this.addCar();
    } else {
      this.editCar();
    }
  }

  private addCar() {
    if(!this.carForm.valid) {
      return console.log("Form is not valid!");
    }

    //SERVICE osztályban megtörténik a hozzáadás, utána visszatér a hozzáadott elemmel, amit hozzáad a listához

  }

  private editCar() {
    if(!this.carForm.valid) {
      return console.log("Form is not valid!");
    }

    //SERVICE osztályban megtörténik a változtatás, utána visszatér a szerkesztett elemmel, amit felülír a listában
    console.log(this.carForm.value);
  }
/*
  resetForm() {
    this.carForm.setValue({licensePlate: this.data.licensePlate, type: this.data.type,
                          fuel: this.data.fuel, consumption: this.data.consumption,
                          mileage: this.data.mileage});
  }

  cancel() {
    this.dialogRef.close(null);
  }*/

  fillFuels() {
    let fuels: string[] = [];
    for(let fuel in Fuel){
      if(fuel) {
        fuels.push(fuel.toLowerCase());
      }
    }

    return fuels;
  }
}
