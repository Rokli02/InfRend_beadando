import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Driver } from 'src/app/models/Driver';
import { AddDriverComponent } from '../add-driver/add-driver.component';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
  @Input() driver !: Driver;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  editDriver() {
    const dialogRef = this.dialog.open(AddDriverComponent, {
      width: '35%',
      panelClass: 'custom-dialog-container',
      data: this.driver
    });

    dialogRef.afterClosed().subscribe((value) => {
      if(value === null || value === undefined){
        console.log("CLOSED");
      }
      else {
        console.log("EDIT");

      }
    });
  }

  deleteDriver() {

  }
}
