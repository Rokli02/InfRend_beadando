import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCarComponent } from './car-list/add-car/add-car.component';

import { CarListComponent } from './car-list/car-list.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { ReportComponent } from './report/report.component';
import { TravelListComponent } from './travel-list/travel-list.component';

const routes: Routes = [
  {
    path: '',
    component: CarListComponent
  },
  {
    path: 'add',
    component: AddCarComponent
  },
  {
    path: 'driver',
    component: DriverListComponent
  },
  {
    path: 'travel',
    component: TravelListComponent
  },
  {
    path: 'report',
    component: ReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
