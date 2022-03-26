import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MonthlyReport } from '../models/MonthlyReport';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  reportForm !: FormGroup;
  monthlyReport : MonthlyReport | null = null;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      year: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      licensePlate: ['', [Validators.required, Validators.minLength(7), Validators.pattern(/[epvz]-[\d]{5}$|[a-zA-Z]{3}-[\d]{3}$|[a-zA-Z]{4}-[\d]{2}$|[a-zA-Z]{5}-[\d]{1}$|[mM][\d]{2} [\d]{4}$|(ck|dt|hc|cd|hx|ma|ot|rx|rr) [\d]{2}-[\d]{2}$|(c-x|x-a|x-b|x-c) [\d]{4}$/)]]
    });
  }

  clearMonthlyReport() {
    this.monthlyReport = null;
  }

  requestMonthlyReport() {
    console.log(this.reportForm.value);
  }
}
