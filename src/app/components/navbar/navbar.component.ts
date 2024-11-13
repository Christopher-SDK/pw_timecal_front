import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isHomeRoute: boolean = false;
  isBusinessRoute: boolean = false;
  isAreaRoute: boolean = false;
  isCalibrationRoute: boolean = false;
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    // Detecta la ruta actual para mostrar u ocultar los botones
    this.isHomeRoute = this.router.url === '/home';
    this.isBusinessRoute = this.router.url === '/business';
    this.isAreaRoute = this.router.url === '/area';

    // Actualizar `isHomeRoute` en cada cambio de ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomeRoute = event.urlAfterRedirects === '/home';
        this.isBusinessRoute=event.urlAfterRedirects==='/business';
        this.isAreaRoute=event.urlAfterRedirects==='/area';
        this.isCalibrationRoute=event.urlAfterRedirects==='/calibration';
      }
    });
  }

  logout() {
    this.userService.logout();    
  }

  userLogged() {
    return this.userService.getCurrentUserId() !== null;
  }
}
