import { Component, OnDestroy, OnInit} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy{
  active !: boolean[];
  routerEventSub !: Subscription;
  constructor(private router: Router) {}

  ngOnDestroy(): void {
    this.routerEventSub.unsubscribe();
  }

  ngOnInit(): void {
    this.routerEventSub = this.router.events.subscribe((value)=> {
      if(value instanceof NavigationEnd) {
        this.chooseActivatedMenu(value.url.toString());
      }
    });
    this.active = new Array<boolean>(4);
  }

  forwardToCars() {
    this.router.navigate(['/']);
  }

  forwardToDrivers() {
    this.router.navigate(['/driver']);
  }

  forwardToTravels() {
    this.router.navigate(['/travel']);
  }

  forwardToReport() {
    this.router.navigate(['/report']);
  }

  private deactivateAll() {
    for(let index in this.active) {
      this.active[index] = false;
    }
  }

  private chooseActivatedMenu(current: string) {
    this.deactivateAll();
    switch(current) {
      case "/" : {
        this.active[0] = true;
      } break;
      case "/driver" : {
        this.active[1] = true;
      } break;
      case "/travel" : {
        this.active[2] = true;
      } break;
      case "/report" : {
        this.active[3] = true;
      } break;
      default : {
      }
    }
  }

}
