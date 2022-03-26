import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  active !: boolean[];
  constructor(private router: Router) {}

  ngOnInit(): void {
    //this.router.navigate(['']);
    this.active = new Array<boolean>(4);
    this.deactivateAll();
    this.active[0] = true;
  }

  forwardToCars() {
    this.deactivateAll();
    this.active[0] = true;
    this.router.navigate(['/']);
  }

  forwardToDrivers() {
    this.deactivateAll();
    this.active[1] = true;
    this.router.navigate(['/driver']);
  }

  forwardToTravels() {
    this.deactivateAll();
    this.active[2] = true;
    this.router.navigate(['/travel']);
  }

  forwardToReport() {
    this.deactivateAll();
    this.active[3] = true;
    this.router.navigate(['/report']);
  }

  private deactivateAll() {
    for(let index in this.active) {
      this.active[index] = false;
    }
  }
}
