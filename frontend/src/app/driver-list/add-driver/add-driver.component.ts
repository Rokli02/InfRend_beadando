import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Driver } from 'src/app/models/Driver';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css']
})
export class AddDriverComponent implements OnInit {
  driverForm !: FormGroup;
  editMode : boolean = false;
  title : string = "Add a new driver";
  handleButton : string = "Add";

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: Driver) {}

  ngOnInit(): void {
    if(this.data){
      this.editMode = true;
      this.title = "Edit driver";
      this.handleButton = "Edit";
    }

    this.driverForm = this.fb.group({
      name: [this.editMode ? this.data.name : '', [Validators.required, Validators.maxLength(256)]],
      birthdate: [this.editMode ? this.data.birthdate : '', [Validators.required]],
      address: [this.editMode ? this.data.address : '', [Validators.required, Validators.maxLength(256)]],
      driverLicense: [this.editMode ? this.data.driverLicense : '', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/[A-Z]{2}[1-9][0-9]{5}/)]],
      driverLicenseExpiration: [this.editMode ? this.data.driverLicenseExpiration : '', [Validators.required]]
    });
  }

  handleDriver() {
    if(this.editMode){
      this.addDriver();
    } else {
      this.editDriver();
    }
  }

  private addDriver() {
    if(!this.driverForm.valid) {
      return console.log("Form is not valid!");
    }

    //SERVICE osztályban megtörténik a hozzáadás, utána visszatér a hozzáadott elemmel, amit hozzáad a listához

  }

  private editDriver() {
    if(!this.driverForm.valid) {
      return console.log("Form is not valid!");
    }

    //SERVICE osztályban megtörténik a változtatás, utána visszatér a szerkesztett elemmel, amit felülír a listában
    console.log(this.driverForm.value);
  }

  resetForm() {
    this.driverForm.setValue({name: this.data.name, birthdate: this.data.birthdate,
                              address: this.data.address, driverLicense: this.data.driverLicense,
                              driverLicenseExpiration: this.data.driverLicenseExpiration});
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
