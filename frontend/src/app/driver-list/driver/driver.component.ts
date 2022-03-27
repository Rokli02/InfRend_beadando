import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Driver } from 'src/app/models/Driver';
import { AddDriverComponent } from '../add-driver/add-driver.component';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit, OnDestroy {
  @Input() driver !: Driver;
  @Output() driverEdited = new EventEmitter<{id: number, driver: any}>();
  @Output() driverDeleted = new EventEmitter<number>();
  dialogSub !: Subscription;

  constructor(private dialog: MatDialog) {}

  ngOnDestroy(): void {
    if(this.dialogSub){
      this.dialogSub.unsubscribe();
    }
  }

  ngOnInit(): void {}

  deleteDriver() {
    this.driverDeleted.emit(this.driver.id);
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
        this.driverEdited.emit({id: this.driver.id, driver: value});
      }
    });
  }
}
