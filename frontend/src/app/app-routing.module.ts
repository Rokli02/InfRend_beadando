import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CarListComponent } from './car-list/car-list.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { ReportComponent } from './report/report.component';
import { AddTravelComponent } from './travel-list/add-travel/add-travel.component';
import { TravelListComponent } from './travel-list/travel-list.component';

const routes: Routes = [
  {
    path: '',
    component: CarListComponent
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
